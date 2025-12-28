+++
title = "Database"
date = 2025-05-01
updated = 2025-12-27
+++

## Relational database

## NoSQL database

## Comparison

-   SQL vs NoSQL
    -   ACID vs BASE
    -   Strong consistency vs eventual consistency
    -   Data deduplication (normalization) vs data compression (de-normalization)
    -   Primary-replica database replication vs peer-to-peer database replication
        -   We have one primary database and multiple replica databases. The primary database handles write requests and propagates the latest data to replica databases. The replica databases take care of read requests. This increases read speed.

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
