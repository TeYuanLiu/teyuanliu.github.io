+++
title = "Etcd"
date = 2025-11-28
updated = 2025-11-28
+++

Etcd is a distributed key-value store that keeps the single source of truth for all configuration data and cluster state for a Kubernetes cluster. All Kubernetes objects like pods, deployments, and services, are stored in etcd.
<!-- more -->

## Data model

Etcd stores data in the key-value pair format.

The key is a unique, hierarchical string that serves as the object's address. It is structured like a file path to enable efficient querying and range lookups. It generally follows the format of `/registry/<resource_type>/<namespace>/<object_name>`, for example, `/registry/pods/default/my-pod`.

The value is the complete YAML/JSON representation of the Kubernetes object, including the `apiVersion`, `kind`, `metadata`, `spec`, and `status`. It is usually stored as a serialized YAML/JSON data blob.

## Data consistency

Etcd uses the Raft consensus algorithm the ensure that data is replicated consistently and reliably across all etcd nodes in a cluster.

### Raft consensus algorithm

The Raft consensus algorithm counts on a leader-follower protocol to enforce data consistency. For a cluster of nodes, there is a leader and the others are followers.

A leader has two duties:
-   Uses the `AppendEntries` Remote Procedure Call (RPC) to:
    -   Send its empty-payload heartbeat to the followers periodically via a heartbeat timer. The timer automatically resets after expiration. A follower resets its election timer when receiving a leader heartbeat.
    -   Replicate data to its followers for write requests and failure recovery. Note that this resets its heartbeat timer as well. 
-   Handle read requests.

An `AppendEntries` contains:
-   Metadata
    -   Follower node ID
    -   Term number
    -   Leader commit index (the highest/latest log entry index the leader has committed)
-   Payload
    -   Write Ahead Log (WAL)
        -   Previous entry (index + term number + key-value pair)
        -   Next entry (index + term number + key-value pair)

#### Write request

1.  A client sends a write request to the leader.
1.  The leader turns the request into a log entry (index + term number + key-value pair), appending the log entry to its WAL file on disk, and then sends out an `AppendEntries` to each follower.
1.  A follower receives an `AppendEntries`, and continues to the below operations:
    1.  The follower checks if its log has an entry matches the previous entry.
    1.  If the check succeeds, the follower adds the next entry to its log and replies with an acknowledgement.
    1.  Otherwise, the follower fails the `AppendEntries` and the leader initiates the log repair process.
        1.  The leader repeats the loop of decrementing the log previous entry and retrying the `AppendEntries` RPC, until the previous entry finally matches an entry in the follower's log.
        1.  The leader forcefully synchronizes all subsequent log entries to the follower.
1.  If the leader receives acknowledgements from a majority of the followers (`ceil((node number + 1) / 2)`), it continues with the below operations.
    1.  It marks the log entry as committed, and applies the log entry to its BoltDB (single-instance file-based key-value store).
    1.  It updates its key-value cache and key-disk-location index.
    1.  It replies to the client with a success message.
    1.  It updates the leader commit index field in its subsequent `AppendEntries`. Any follower that receives an `AppendEntries` uses the leader commit index to apply the entries to its BoltDB.
1.  Otherwise, it fails the client's write request.

Due to the frequent writes to the log, etcd's performance heavily relies on the disk I/O speed so SSDs are often the top choice for it.

#### Read request

1.  A client sends a read request to the leader.
1.  The leader ensures the data it serves is fresh by verifying its leader position via lease validation or even sending out its heartbeat to a majority of the followers.
1.  It checks the key-value cache. If the key is in the cache, it replies to the client.
1.  Otherwise, it checks the key-disk-location index. If the key is in the index, it reads the value from the BoltDB and replies to the client. It also updates the key-value cache.
1.  Otherwise, it searches in the BoltDB. If the key is in the BoltDB, it reads the value from the BoltDB, and replies to the client. It also updates the key-value cache and key-disk-location index.
1.  Otherwise, it fails the client's read request.

#### Leader election

A leader can be generated via the leader election process:
1.  States
    1.  Every node starts with the follower state and the term number of 0, and has its own election timer.
    1.  If the node hasn't received an `AppendEntries` message from a leader and the election timer times out, it assumes the leader is down and transitions itself from a follower into a candidate. It increments its current term number by 1 and resets the election timer.
1.  Voting
    1.  The candidate votes for itself for the current term number (each node has one vote for a given term number), and sends out the `RequestVote` message to others to ask for their votes.
    1.  From the perspective of the `RequestVote` receiver, it performs the following operations after receiving the message:
        1.  The receiver checks if the requesting candidate's term number is greater than or equal to the receiver's current term number. If the requesting candidate's term number is higher, the receiver updates its term number and steps down to become a follower.
        1.  The receiver checks if it has not yet voted in its current term.
        1.  The receivers checks that whether the requesting candidate's WAL is at least as up-to-date as the receiver's WAL by comparing the last log index and term number.
        1.  If all three checks pass, the receiver grants the vote and resets its election timer. Otherwise, it rejects the `RequestVote`.
1.  Winning
    1.  If a candidate receives votes from a majority of the nodes, it becomes the new leader. If two candidates get the same votes, neither of them satisfies the majority vote rule so no leader is elected. Every node watches its election timer and starts another round of leader election after the timer expires (the timer is randomized to avoid indefinite staleness).
1.  Heartbeat
    1.  The new leader starts sending out its heartbeat constantly.

##### Disconnection and reconnection

If a follower disconnects from the cluster and no longer receives a leader heartbeat, it transitions to a candidate, incrementing its term number, and resets the election timer. Because it is isolated from the others, it cannot get enough votes to become a leader. The election timer eventually times out and it restarts the leader election process. This election failure loop can make this isolated node having a large term number.

When the node reconnects to the cluster, if its term number is larger than the cluster leader's, it rejects the `AppendEntries` from the leader with its own term number, forcing the leader to update its own term number and reverts to the follower state.

The cluster becomes leaderless and waits for a node to start its leader election.

#### Scaling

The requirement for a leader to coordinate all writes and secure a quorum for commitment creates a bottleneck, limiting throughput and increasing latency.

#### Write optimization

-   Vertical scaling
    -   Use NVMe SSDs for cluster nodes as WAL disk sync is sensitive to disk I/O throughput and latency.
    -   Use high-speed network as the network round-trip time is a major component of write latency.
    -   Enable dynamic write request batching such that the leader can put multiple requests into a single large log entry before doing data replication, amortizing the disk sync and networking cost. 

#### Read optimization

-   Leader lease
    -   The leader periodically issues a lease for itself. The lease stays valid for a short time and is sent to the followers using heartbeats.
    -   During the lease period, the leader is guaranteed to be the current leader.
    -   The leader can then serve read requests locally without involving the followers or checking its log, reducing read latency.
-   Read offloading
    -   Followers can serve reads by following the below operation:
        1.  A client sends a read request to a follower.
        1.  The follower asks the leader for the leader commit index.
        1.  The follower waits until its log has been replicated up to the leader commit index.
        1.  The follower serves the read request.
-   Sharding
    -   Split the entire dataset into smaller shards.
    -   Each shard is handled by an independent Raft cluster.
    -   Requests are routed to the correct shard based on the key range.

## See also