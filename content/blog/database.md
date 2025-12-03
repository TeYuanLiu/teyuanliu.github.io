+++
title = "Database"
date = 2025-05-01
updated = 2025-05-01
+++

## Scaling

### Read

#### Sharding

There are different types of sharding:
-   Range based sharding
    -   Partition the table rows according to ID ranges, like the rows with ID 1 to 100 go to shard 1, and 101 to 200 go to shard 2.
-   Hash based sharding
    -   Use a hash function to hash the ID of a table row to its shard number.
-   Directory based sharding
    -   Use a lookup table to map the ID of a table row to its shard number based on directory.

A shard manager takes care of the lifecycle management of shards. It can dynamically creates, splits, and merges shards on-the-fly based on traffic forecasting to handle various loads.

## See also
