+++
title = "System Design"
date = 2025-04-25
updated = 2025-05-01
+++

Ok, we want to build a software product, but where should we start?

Well, let's first think about what are the functional and non-functional requirements. This gives us a long list of questions to answer.
<!-- more -->

## Functional requirements (scope)

-   What kind of features should we provide?
    -   What's the feature's input?
    -   What's the feature's output?
-   What does the storage/API schema look like?

## Non-functional requirements

-   Scalability
    -   Traffic
        -   How many total users?
        -   How many concurrent users?
        -   How many write requests per second?
        -   How many read requests per second?
        -   What are the latency and throughput requirement?
    -   Long-term (5-year) storage
-   Availability
    -   What is the service uptime requirement?
-   Reliability
    -   What is the data consistency requirement?

## Layout

After clarifying the functional and non-functional requirements of the system, we move on to sketching out the system layout. Modern systems usually need high scalability/availability/reliability so here we design a distributed system to satisfy the requirements.

-   Client
-   Load balancer
-   API gateway
    -   Security
        -   TLS
        -   Rate limiting
        -   Authentication and authorization
    -   Caching
    -   Metric monitoring
    -   Logging
    -   Routing
-   Service
    -   User
    -   Business logic
    -   Observability
        -   Metric monitoring
        -   Alerting
        -   Logging
        -   Analytics
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
-   Queue
    -   Message queue
    -   Task queue
-   Communication
    -   TCP
        -   HTTP
            -   REST
            -   GraphQL
            -   gRPC
    -   QUIC (UDP)
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
