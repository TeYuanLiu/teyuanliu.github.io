+++
title = "Raft"
date = 2026-10-18
updated = 2026-11-12
+++

Raft is a consensus algorithm that ensures data consistency among a cluster of nodes. It counts on a leader-follower protocol to enforce the nodes to agree on a single, ordered sequence of data manipulation commands, known as the Write-Ahead Log (WAL). If all nodes have the same WAL, we know that they have the same state of data.
<!-- more -->

## Node role

There are 3 roles and each node can only be one of them at any time.

-   Follower
    -   Receive data synchronization from the leader.
-   Candidate
    -   Run the leader election.
-   Leader
    -   Synchronize data via heartbeat to others.
    -   Handle client requests.

## Node state

Every node has the following states.

-   currentTerm
    -   The highest term the node has seen.
    -   It is initialized to 0 and increases monotonically.
-   votedFor
    -   The candidateID that received the node's vote in current term.
    -   It is null if the node hasn't voted yet.
-   log[]
    -   The log entries of the WAL.
    -   Each entry contains its index, term, and data manipulation command.
    -   The first entry has index 1.
-   commitIndex
    -   The highest log index whose log entry is committed.
    -   It is initialized to 0 and increases monotonically.
-   lastApplied
    -   The highest log index whose data manipulation command is applied.
    -   It is initialized to 0 and increases monotonically.

The leader has the following extra states which are reinitialized right after its conversion to the leader.

-   matchIndex[]
    -   The highest log index whose log entry is replicated to that node for each node.
    -   Each entry is initialized to 0 and increases monotonically.
-   nextIndex[]
    -   The index of the next log entry to send to that node for each node.
    -   Each entry is initialized to the leader's highest log index + 1.

## Operation path

{% mermaid() %}
flowchart TB
    follower -- election timeout --> candidate
    candidate -- discover leader or higher term --> follower
    candidate -- restart election after election timeout --> candidate
    candidate -- run election --> others
    others -- response --> candidate
    candidate -- win election --> leader
    leader -- sync logs --> others
    others -- response --> leader
    leader -- discover higher term --> follower
    client -- request --> leader
    leader -- response --> client
{% end %}

1.  A node starts with the follower role and an election timer (randomized between 150 ms and 300 ms).
1.  If the node grants its vote to a RequestVote or receives an AppendEntries, it restarts the election timer. Otherwise, when the election timer expires, it assumes the leader is gone and converts its role from follower to candidate.
1.  The new candidate node performs the following steps.
    1.  Increment the currentTerm.
    1.  Vote for itself.
    1.  Restart the election timer.
    1.  Send RequestVote to others.
        -   If the node receives votes from the majority of nodes, it becomes the leader.
        -   If the node receives an AppendEntries with term T >= currentTerm, it converts to follower.
        -   If the election timer expires, it starts a new election.
1.  The new leader performs the following tasks.
    -   Send AppendEntries as heartbeat to others periodically (every 50 ms) based on the expiration of its leader heartbeat timer.
    -   Handle a client request by performing the following steps.
        1.  Append an entry to its log.
        1.  Send AppendEntries to others on next heartbeat.
            -   For nodes with success, increase their matchIndex and nextIndex.
            -   For nodes with failure, decrease their nextIndex and retry.
        1.  Conduct majority check.
            1.  If the majority of matchIndex[i] >= commitIndex + x with positive x and log[commitIndex + x].term == currentTerm, set commitIndex = commitIndex + x.
            1.  If commitIndex > lastApplied, increment lastApplied and apply the command of log[lastApplied].
        1.  Reply to the client based on majority check result.

There are some additional rules.

-   If the request or response of RequestVote or AppendEntries contains a term T > the node's currentTerm, update the node's currentTerm to T and convert to follower.
-   If a node has commitIndex > lastApplied, increment lastApplied and apply the command of log[lastApplied].

### RequestVote

-   Request
    -   term
        -   The candidate's currentTerm
    -   candidateId
        -   The candidate's node ID
    -   lastLogIndex
        -   The index of the candidate's last log entry
    -   lastLogTerm
        -   The term of the candidate's last log entry
-   Response
    -   term
        -   The receiver's currentTerm
    -   voteGranted
        -   The receiver's vote
        -   It is true if the receiver grants its vote to the candidate.
-   Receiver implementation
    -   If the receiver's votedFor is null or the candidate's ID, and the candidate has term T >= the receiver's currentTerm, and the candidate has log at least as up-to-date as the receiver's, the receiver grants the vote.

### AppendEntries

-   Request
    -   term
        -   The leader's currentTerm
    -   leaderId
        -   The leader's node ID for request redirection
    -   prevLogIndex
        -   The index of the log entry immediately preceding the new ones
    -   preLogTerm
        -   The term of the log entry immediately preceding the new ones
    -   entries[]
        -   The log entries to store
    -   leaderCommit
        -   The leader's commitIndex
-   Response
    -   term
        -   The receiver's currentTerm
    -   success
        -   If the receiver has a log entry with matching prevLogIndex and prevLogTerm, the receiver returns true.
-   Receiver implementation
    1.  If the leader's currentTerm < the receiver's currentTerm, reply false.
    1.  If the receiver doesn't have an log entry at prevLogIndex with matching prevLogTerm, reply false.
    1.  If a new log entry has the same index but different terms that conflicts with an existing entry, delete the existing entry and all the following.
    1.  Append new entries.
    1.  If leaderCommit > commitIndex, set commitIndex = min(leaderCommit, last new entry index).

### Uncommitted log entry by leader shutdown scenario

1.  The leader appends a new entry E1 to its log.
1.  The leader sends out a heartbeat so every node has the uncommitted E1.
1.  The leader receives acknowledgements from the majority of nodes.
1.  The leader commits and applies E1.
1.  The leader replies to the client.
1.  Before sending out another heartbeat to inform the followers to commit and apply E1, the leader encounters a shutdown.
1.  A follower becomes the new leader. At this point, there is a conflict between the client's understanding of the data state (E1 is applied) and the actual data state (E1 is not applied).
1.  The new leader appends a no-op log entry E2 to its log.
1.  The new leader sends out a heartbeat.
1.  The leader receives acknowledgements from the majority of nodes.
1.  The new leader commits and applies both E1 and E2.
1.  The new leader sends out another heartbeat to inform the followers to commit and apply E1 and E2, and this should fix the mismatch.

### Disconnection and reconnection

If a follower disconnects from the cluster and no longer receives the leader heartbeat, it converts to a candidate, incrementing its term number, and resets the election timer. Because it is isolated from the others, it cannot get enough votes to become a leader. The election timer eventually expires and it restarts the leader election process. This election failure loop can make this isolated node having a large term number.

When the node reconnects to the cluster, if its term number is larger than the cluster leader's, it rejects the AppendEntries from the leader with its own term number, forcing the leader to update its own term number and revert to the follower state.

The cluster becomes leaderless and waits for a node to start its leader election. Note that the reconnected node may have outdated logs and lose its upcoming leader election because of it.

### Write request scaling

-   Vertical scaling
    -   Use Non-Volatile Memory express (NVMe) SSDs for cluster nodes as WAL disk sync is sensitive to disk I/O throughput and latency.
    -   Use high-speed network as the network round-trip time is a major component of write latency.
    -   Enable dynamic write request batching such that the leader can put multiple requests into a single large log entry before doing data replication, amortizing the disk sync and networking cost.

### Read request scaling

-   Leader lease
    -   The leader ensures its leader position via the leader lease.
    -   The leader periodically issues a lease for itself via its heartbeat.
    -   The lease stays valid for a short time (150 ms) and during the lease period, the leader is guaranteed to be the current leader.
-   Adding learner
    -   A learner is a node that only does data replication.
    -   It doesn't participate in any voting.
    -   The leader doesn't wait for a learner's acknowledgement of the AppendEntries before committing the WAL entry.
    -   This increase read throughput without sacrificing write latency.
-   Sharding
    -   Split the entire dataset into smaller shards.
    -   Each shard is handled by an independent Raft cluster.
    -   Requests are routed to the correct shard based on key range or directory.

## Operation simplification

-   Remove lastApplied.
-   Remove matchIndex[].

## References
