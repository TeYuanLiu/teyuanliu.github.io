+++
title = "Database"
date = 2025-05-01
updated = 2026-11-25
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
    -   Reservation cache
        -   Use a cache to store in-progress reservation to decrease the number of inventory-checking queries hitting the database.
        -   Example
            -   The cache is a key-value store with format `order_id: (user_id, product_id, quantity, expires_at)`.
                -   Assuming the checkout page timeout is 10 minutes and the order processing timeout is 1 minute, then the `expires_at` is `Now() + 11 minutes`, considering the edge case that the user clicks `Place order` at the very last second of the checkout page timeout.
            -   Workflow
                1.  On a product page, the user inputs the quantity and clicks `Start order`.
                1.  The frontend sends the order to the backend.
                1.  The backend checks the inventory availability through subtracting the total inventory by the sum of quantities across all orders in the reservation cache. If the check passes then the backend creates a record in the cache and directs the user to the checkout page. Otherwise, the order is rejected and no record is created and the user receives an error message.
                1.  On the checkout page, the user is given 10 minutes to click `Place order` to complete the order. If the user places the order successfully the backend updates the order table and the total inventory, and then directs the user to the confirmation page. Otherwise, the system directs the user to the checkout timeout page.
-   CDN
-   Replication
-   Sharding

### Write

-   Command Query Request Separation (CQRS)
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
