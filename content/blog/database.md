+++
title = "Database"
date = 2025-05-01
updated = 2026-11-06
+++

## Relational database

## NoSQL database

## Comparison

-   SQL vs NoSQL
    -   ACID vs BASE
    -   Strong consistency vs eventual consistency
    -   Data deduplication (normalization) vs data compression (de-normalization)
    -   Replication
        -   Primary-replica
            -   Contain a fixed primary and multiple replicas.
            -   The primary handles write requests.
            -   The primary synchronizes data to replicas.
            -   The replicas handle read requests.
            -   Pros
                -   Simple to implement and maintain
            -   Cons
                -   Serious availability hit during leader failure
                -   Weak consistency due to stale data read caused by data synchronization delay
        -   [Raft](@/blog/raft.md)
            -   Contain a non-fixed leader and multiple followers.
            -   A follower can become the new leader via election if the leader fails.
            -   Pros
                -   High availability
                -   Strong consistency
            -   Cons
                -   More complex to implement and maintain

### Tradeoff

-   Latency
-   Throughput
-   Consistency
-   Scalability
-   Availability
-   Reliability

## Scaling

### Read

-   Optimized query
-   Indexing
-   Caching
    -   Read-through cache vs write-through cache
-   CDN
-   Replication
-   Sharding

### Write

-   Control Query Request Separation (CQRS)
-   Event sourcing
    -   Write-Ahead Logging (WAL)
        -   Ensure atomicity (all-or-nothing) and durability (data persistence) of the ACID properties by first appending a write transaction to a sequential log file on disk and then committing it to the database. If the system crashes, it can recover by replaying the log to restore the data to a consistent state.
-   Write batching
-   Asynchronous processing
-   Sharding

### Sharding

There are different types of sharding:
-   Range based sharding
    -   Partition the table rows according to ID ranges, like the rows with ID 1 to 100 go to shard 1, and 101 to 200 go to shard 2.
-   Hash based sharding
    -   Use a hash function to hash the ID of a table row to its shard number.
-   Directory based sharding
    -   Use a lookup table to map the ID of a table row to its shard number based on directory.

A shard manager takes care of the lifecycle management of shards. It can dynamically creates, splits, and merges shards on-the-fly based on traffic forecasting to handle various loads.

## References
