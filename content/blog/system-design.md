+++
title = "System Design"
date = 2025-04-25
updated = 2025-05-01
+++

Ok, we want to build a software product, but where should we start?

Well, let's first think about the functional and non-functional requirements of our product. This gives us a list of questions to answer.
<!-- more -->

## Functional requirement (scope)

-   What features do we provide?
-   What does the API schema look like?
-   What does the storage schema look like?
-   What kind of storage do we use?

## Non-functional requirement

-   Scalability
    -   Traffic
        -   How many total users?
        -   How many concurrent users?
        -   How many write requests per second?
        -   How many read requests per second?
        -   What are the latency and throughput requirements?
            -   Latency
                -   1   ns for cache
                -   100 ns for memory
                -   100 us for Non-Volatile Memory express (NVMe) drive
                -   5   ms for Hard-Disk Drive (HDD)
    -   Storage
        -   How much storage is needed for 5 years?
-   Availability
    -   What is the service uptime requirement?
-   Reliability
    -   What is the fault tolerance requirement?
    -   What is the data durability requirement?

## Layout

After clarifying the functional and non-functional requirements of the system, we move on to sketching out the system layout. Modern systems usually need high scalability/availability/reliability so here we design a distributed system to satisfy the requirements.

-   Client
-   Load balancer
-   API gateway
    -   Security
        -   Authentication and authorization
        -   TLS
        -   Rate limiting
    -   Transforming
    -   Routing
    -   Caching
    -   Metric monitoring
    -   Alerting
    -   Logging
-   Service
    -   Each service follows the pattern of Kafka queue -> logic <-> storage.
    -   Business logic
    -   Observability
        -   Metric monitoring
        -   Alerting
        -   Logging
    -   Analytic
        -   HDFS storage
        -   Impala HDFS query 
        -   Hive data management and HiveQL query
        -   Spark batch processing
        -   Oozie job orchestration
        -   YARN resource management
-   Storage
    -   Latency
    -   Throughput
    -   Scalability
    -   Availability
    -   Reliability
-   Cache
    -   Database cache
    -   Content-Delivery Network (CDN)
    -   Client-side cache
-   Communication
    -   TCP
        -   HTTP
            -   REST
            -   GraphQL
            -   gRPC
        -   WebSocket
    -   UDP
        -   gRPC

## Performance boost

-   Availability (assuming load staying within capacity)
    -   Service uptime
        -   Redundancy
        -   Self-healing
-   Reliability (assuming load staying within capacity)
    -   Logic execution correctness
        -   Input validation
        -   Isolation (cell-based design)
        -   Retry
        -   Request idempotency
            -   GET/PUT/DELETE are usually idempotent.
            -   Use POST with idempotency keys.
    -   Data durability
        -   Data replication
        -   Write-Ahead Logging (WAL)
            -   Ensure atomicity (all-or-nothing) and durability (data persistence) of the ACID properties by first appending a write transaction to a sequential log file on disk and then committing it to the database. If the system crashes, it can recover by replaying the log to restore the data to a consistent state.
-   Scalability
    -   Auto scaling
    -   Rate limiting
    -   Graceful quality degradation

## Next step

Once we have decided how we structure the system, we can go ahead with the [development cycle](@/blog/development-cycle.md).

## See also
