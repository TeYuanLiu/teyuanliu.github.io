+++
title = "Etcd"
date = 2025-11-28
updated = 2026-06-28
+++

Etcd is a distributed key-value store that keeps the single source of truth for all configuration data and cluster state for a [Kubernetes](@/blog/kubernetes.md) cluster. All Kubernetes objects like pods, deployments, and services, are stored in etcd.
<!-- more -->

## Data model

Etcd stores data in the key-value pair format.

The key is a unique, hierarchical string that serves as the object's address. It is structured like a file path to enable efficient querying and range lookups. It generally follows the format of `/registry/<OBJECT_TYPE>/<OBJECT_NAMESPACE>/<OBJECT_NAME>`, for example, `/registry/pods/default/my-pod`.

The value is the complete YAML/JSON representation of the Kubernetes object, including the `apiVersion`, `kind`, `metadata`, `spec`, and `status`. It is usually stored as a serialized YAML/JSON data blob.

## Data consistency

Etcd uses the Raft consensus algorithm the ensure that data is replicated consistently and reliably across all etcd nodes in a cluster.

### Raft consensus algorithm

The Raft consensus algorithm counts on a leader-follower protocol to enforce data consistency. For a cluster of nodes, there is a leader and the others are followers.

A leader has two duties:
-   Use the `AppendEntries` Remote Procedure Call (RPC) to:
    -   Send its empty-payload heartbeat to the followers periodically (every 50ms) via a heartbeat timer. The timer automatically resets after expiration. A follower resets its election timer (randomized between 150ms to 300ms) when receiving a leader heartbeat.
    -   Replicate data to its followers for write requests and failure recovery. Note that this resets its heartbeat timer as well.
-   Handle read and write requests.

An `AppendEntries` contains:
-   Metadata
    -   Leader ID
    -   Leader term number
    -   Leader commit index (The last/largest/latest log index the leader has committed)
-   Payload
    -   Write Ahead Log (WAL)
        -   Previous entry (index + term number + key-value pair)
        -   Next entries
            -   Next entry 1 (index + term number + key-value pair)
            -   Next entry 2

#### Leader election

A leader can be generated via the leader election process:
1.  States
    1.  Every node starts with the follower state and the term number of 0, and has its own election timer.
    1.  If the node hasn't received an `AppendEntries` message from a leader and the election timer expires, it assumes the leader is down and transitions itself from a follower into a candidate. It increments its current term number by 1 and resets the election timer.
1.  Voting
    1.  The candidate votes for itself for the current term number (each node has one vote for a given term number), and sends out the `RequestVote` message to others to ask for their votes.
        1.  Every `RequestVote` receiver checks if the requesting candidate's term number is larger than the receiver's current term number. If the requesting candidate's term number is greater, the receiver updates its term number and steps down to become a follower.
        1.  The receiver checks if it has not yet voted in its current term.
        1.  The receiver checks that whether the requesting candidate's WAL is at least as up-to-date as the receiver's WAL by comparing the last log index and term number.
        1.  If all three checks pass, the receiver grants the vote and resets its election timer. Otherwise, it rejects the `RequestVote` with its current term number.
1.  Winning
    1.  If a candidate receives votes from a majority of the nodes (`ceil((node count + 1) / 2)` or `floor(node count / 2) + 1`), it becomes the new leader. If two candidates get the same votes, neither of them satisfies the majority vote rule so no leader is elected. Every node watches its election timer and starts another round of leader election after the timer expires (the timer is randomized to avoid indefinite staleness).
1.  Heartbeat
    1.  The new leader starts sending out its heartbeat constantly.

##### Disconnection and reconnection

If a follower disconnects from the cluster and no longer receives the leader heartbeat, it transitions to a candidate, incrementing its term number, and resets the election timer. Because it is isolated from the others, it cannot get enough votes to become a leader. The election timer eventually expires and it restarts the leader election process. This election failure loop can make this isolated node having a large term number.

When the node reconnects to the cluster, if its term number is larger than the cluster leader's, it rejects the `AppendEntries` from the leader with its own term number, forcing the leader to update its own term number and reverts to the follower state.

The cluster becomes leaderless and waits for a node to start its leader election. Note that the reconnected node may have outdated logs and lose its upcoming leader election because of it.

#### Write request

1.  A client sends a write request to the leader.
1.  The leader turns the request into a log entry (index + term number + key-value pair), appending the log entry to its WAL file on disk.
1.  The leader sends out an `AppendEntries` to each follower.
    1.  Every follower that receives an `AppendEntries` checks if its log has an entry matching the previous entry in the `AppendEntries`.
    1.  If the check succeeds, the follower adds the next entry to its log and replies with an acknowledgement.
    1.  Otherwise, the follower fails the `AppendEntries` and the leader initiates the log repair process.
        1.  The leader repeats the loop of decrementing the log previous entry and retrying the `AppendEntries` RPC, until the previous entry finally matches the follower's last log entry.
        1.  The leader forcefully synchronizes all subsequent log entries to the follower via an `AppendEntries`.
1.  If the leader doesn't receive acknowledgements from a majority of the followers, it fails the client's write request. Otherwise, it continues with the below operations.
1.  The leader marks the log entry as committed, updating its commit index, and applies the log entry to its BoltDB (single-instance file-based key-value store).
1.  The leader updates its key-value cache and key-disk-location index.
1.  The leader sends out an `AppendEntries` to each follower.
    1.  Every follower that receives an `AppendEntries` uses the leader commit index to commit and apply the entry and then replies with an acknowledgement.
1.  If the leader receives acknowledgements from a majority of the followers, it replies to the client with a success message. Otherwise, it fails the client's write request.

Due to the frequent writes to the log, etcd's performance heavily relies on the disk I/O speed so SSDs are often the top choice for it.

##### Uncommitted log entry by leader shutdown scenario

1.  The leader commits and applies the log entry.
1.  Before sending out a heartbeat, the leader encounters a shutdown. Now every follower has an uncommitted log entry.
1.  One follower becomes the new leader and keeps the uncommitted log entry.

#### Read request

1.  A client sends a read request to the leader.
1.  The leader ensures its leader position via the leader lease.
    -   The leader periodically issues a lease for itself via its heartbeat.
    -   The lease stays valid for a short time (150 ms) and during the lease period, the leader is guaranteed to be the current leader.
1.  It checks the key-value cache. If the key is in the cache, it replies to the client.
1.  Otherwise, it checks the key-disk-location index. If the key is in the index, it reads the value from the BoltDB and replies to the client. It also updates the key-value cache.
1.  Otherwise, it searches in the BoltDB. If the key is in the BoltDB, it reads the value from the BoltDB, and replies to the client. It also updates the key-value cache and key-disk-location index.
1.  Otherwise, it fails the client's read request.

#### Scaling

The requirement for a leader to coordinate all writes and secure a quorum for commitment creates a bottleneck, limiting throughput and increasing latency.

#### Write optimization

-   Vertical scaling
    -   Use Non-Volatile Memory express (NVMe) SSDs for cluster nodes as WAL disk sync is sensitive to disk I/O throughput and latency.
    -   Use high-speed network as the network round-trip time is a major component of write latency.
    -   Enable dynamic write request batching such that the leader can put multiple requests into a single large log entry before doing data replication, amortizing the disk sync and networking cost.

#### Read optimization

-   Adding learner
    -   A learner is a node that only does data replication.
    -   It doesn't participate in any voting.
    -   The leader doesn't wait for a learner's acknowledgement of the `AppendEntries` before commiting the WAL entry.
    -   This increase read throughput without sacrificing write latency.
-   Sharding
    -   Split the entire dataset into smaller shards.
    -   Each shard is handled by an independent Raft cluster.
    -   Requests are routed to the correct shard based on key range or directory.

## References
