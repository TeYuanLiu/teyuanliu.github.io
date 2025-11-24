+++
title = "Distributed System"
date = 2025-05-02
updated = 2025-05-04
+++

A distributed system is a system consists of many services running independently on different servers (servers can be physical machines, VMs, or containers) and connected via a network. Although its services are distributed, it appears as a single entity to the end user.
<!-- more -->

## Tradeoffs

In the [system design post](@/blog/system-design.md###microservice) we shared that a distributed system has good:
-   Availability
-   Reliability
-   Scalability
-   Flexibility

But faces challenges for:
-   Development
-   Testing
-   Deployment
-   Monitoring
-   Maintenance
-   Performance
-   Data consistency

### CAP theorem

CAP theorem states similar tradeoffs. It says we can only achieve two out of the three guarantees at any given time:
-   Consistency (C)
    -   Every request receives the latest data (an error otherwise).
-   Availability (A)
    -   Every request receives a response without error (but may contain obsolete data).
-   Partition Tolerance (P)
    -   The system continues to operate even if there are network partitions, which means some servers lost connection to others.

In a distributed system, partition tolerance is a requirement because network failures happen all the time, so we have to choose between consistency and availability.
-   CP
    -   Preferring consistency over availability, thus the requests hitting the isolated servers fail with an error because the system cannot return the latest data.
-   AP
    -   Preferring availability over consistency, thus the requests hitting the isolated servers receive possibly obsolete data.
    
## Scaling

Here are a few things we need to know about scaling a distributed system.

-   Stateless service
    -   Services don't store user data like user sessions on their servers. User data is stored in a centralized storage like a cluster of RAIDs. Therefore, users can have the same session despite hitting different servers. This makes services easier to scale horizontally.
-   Routing
    -   Route requests to different services based on request type.
-   Vertical scaling (scale-up)
    -   Upgrade to a more powerful server.
-   Horizontal scaling (scale-out)
    -   Use more servers to run more copies of the same service.
-   Load balancing
    -   Distribute requests among multiple servers using methods like round-robin.
-   Auto scaling
    -   Scale horizontally in a dynamic way based on real-time traffic.
-   [Caching](@/blog/caching.md)
    -   Store request-response pairs to handle repetitive requests quickly without making expensive API or [database](@/blog/database.md) calls over and over again.
        -   Client-side cache
        -   CDN cache
        -   Load balancer cache
        -   Message queue cache
        -   Service
            -   CPU cache
            -   RAM cache
            -   Disk cache
        -   In-memory cache
        -   Database cache
-   Database selection
    -   Choose SQL databases for consistency or NoSQL databases for availability and scalability.
-   Database replication
    -   Replicate the same database across multiple servers.
    -   Primary-replica
        -   We have one primary database and multiple replica databases. The primary database handles write requests and propagates the latest data to replica databases. The replica databases take care of read requests.
    -   This increases read speed.
-   Database sharding
    -   Split the existing database into multiple smaller databases and each one of them handles a subset of the data based on certain criteria.
    -   This increases both read and write speed.
-   Asynchronous processing
    -   Run time-consuming and resource-intensive tasks during off-peak hours or on background servers.

### Scaling example

Here is a simulated example for scaling a client-server application.

1.  Initially we launch the application with a minimal setup:
    -   A client application
    -   An application server
    -   A database server
2.  As more and more user requests hitting the application server, our application server fails to handle them all, probably due to CPU, memory, and connection limit.
    -   We can upgrade the application server to a more powerful machine (vertical scaling).
    -   If that's not enough, we can set up more application servers and a load balancer to handle increasing traffic (horizontal scaling and load balancing).
    -   We can also set up a CDN to cache static assets (caching).
3.  As more and more user data stored in our database, database query speed slows down.
    -   We can upgrade the database server to a more powerful machine (vertical scaling). 
    -   Read
        -   If that's not enough, we can put a cache between the application servers and the database to speed up database read operations (caching).
        -   If that's not enough, we can do database replication (database replication).
    -   Write
        -   If that's not enough, we can shard the database into multiple smaller ones to accelerate write operations (database sharding). 
4.  As we add more and more features, the application server fails to handle them all, probably due to CPU and memory limit, or dependency conflicts.
    -   We can upgrade the application server to a more powerful machine (vertical scaling).
    -   If that's not enough, we can split the application into multiple services and run each of them in a separate server. We also use an API gateway (or even a cluster of gateways) to route the requests to different services (routing).

The scaled client-server application has the following final layout:
-   The client application that serves as the user interface.
-   A CDN that serves static assets quickly.
-   A load balancer that distributes traffic across multiple API gateway instances running on different servers to maximize availability and performance.
    -   Load balancing
    -   TLS termination
-   A cluster of API gateways that control access and route requests to APIs:
    -   Rate limiting
        -   DDoS
    -   Logging
    -   Authentication/authorization
    -   Routing
-   A message broker or message queue for event-driven processing
-   A distributed cache
-   A collection of services that takes care of:
    -   User
    -   Business logic
    -   Observability
        -   Logging
        -   Metrics
        -   Alerting
        -   Analytics
-   A group of databases that addresses:
    -   Latency
    -   Throughput
    -   Availability
    -   Reliability
    -   Scalability
-   A set of communication methods:
    -   Application layer
        -   REST (HTTP/HTTP2, TCP)
        -   GraphQL (HTTP/WebSocket, TCP)
        -   gRPC (HTTP2/QUIC, TCP/UDP)
    -   Transport layer
        -   TCP
        -   UDP

## Security

System [security](@/blog/security.md) has become more and more important.

## See also
