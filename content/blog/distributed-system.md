+++
title = "Distributed System"
date = 2025-05-02
updated = 2025-05-04
+++

A distributed system is a system consists of many services running independently on different physical machines or Virtual Machines (VM) and connected via a network. Although its services are distributed, it appears as a single entity to the end user.
<!-- more -->

However, when we want to create a software application, distributed system may not be the one that first shows up in our mind. A more intuitive and straightforward way is to create one single application that handles the end-to-end workflow. This tightly-coupled structure leads us to the monolithic architecture.

## Monolithic

A monolithic system is built as a single, indivisible unit. All components of the system are tightly coupled.

Because the components reside in the same place, it has several benefits:
-   Development is intuitive as coordination among components is obvious.
-   [Testing](@/blog/testing.md) is easy because the application has one codebase and can be tested end-to-end as a single unit.
-   Deploying, monitoring, and maintaining is straightforward as we can run a single [container](@/blog/container.md) or VM to host the application with configuration stored as environment variables.
-   Performance like latency is very good since we are doing in-process calls.
-   Data is consistent because we have only one database to interact with.

This architecture well fits the use case like building a prototype. However, as time goes by and the application grows bigger in terms of number of features and users, certain drawbacks gradually emerge:
-   If one component crashes, it brings down the entire application. This exposes the system's lack of fault tolerance and thus low reliability. Low reliability hurts the uptime and deteriorates availability.
-   Scaling a specific component independently, which may require more resources than others, is impossible because everything is bundled as one unit so we are forced to scale all components together. Plus, vertical scaling (upgrading to a more powerful machine) hits certain limit because even the world's most powerful machine has compute and memory constraint.
-   Flexibility is restrained as changing a part of the system requires redeployment of the entire application, not to mention that changing one component can produce bugs in other components.

These downsides bring us to another architecture, microservice, which is the foundation for distributed systems.

## Microservice

A microservice architecture breaks down the application into small, loosely coupled, independently deployable microservices. Each service is responsible for a specific business functionality and communicates with other services through APIs.

The microservice architecture addresses some of the pain points of the monolithic architecture:
-   Availability and reliability are higher because we can have multiple copies of the same service running simultaneously, so one service replica's failure doesn't necessarily bring down the whole application.
-   Individual services can be scaled independently based on demand. Horizontal scaling (adding more machines) unlocks the capability of handling large volume of requests.
-   The flexibility of changing each service independently allows more agile development.

However, just like a coin has two sides, the microservice architecture overcomes the monolithic architecture's shortcomings, but struggles to match the monolithic architecture's strengths:
-   Development is more difficult because there are multiple codebases to manage and the coordination among services requires service discovery, load balancing and inter-service communication.
-   Testing is more complicated as we need to test each component's functionality and the integration among services.
-   Deploying, monitoring, and maintaining many services need robust operation practices and tools.
-   Performance like latency is not great due to the delay brought by communication between services over the network.
-   Data consistency is challenging to maintain across multiple services.

## Tradeoffs

To sum up, a distributed system has good:
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

When choosing the architecture for our system, it all comes down to the question: which set of metrics matters?

If our product needs high availability, reliability, scalability, or flexibility, we probably want something like the microservice architecture, otherwise, something similar to the monolithic architecture is probably a better choice.

In reality we often have a fixture of both. We can apply the microservice architecture to components that need availability, reliability, scalability, or flexibility, while grouping others into a monolithic component.

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
    -   Store request-response pairs to handle repetitive requests quickly without making the expensive API or [database](@/blog/database.md) call over and over again.
        -   Client-side cache
        -   Content-Delivery Network (CDN) cache
        -   Load balancer cache
        -   Message queue cache
        -   Service
            -   CPU cache
            -   RAM cache
            -   Disk cache
        -   In-memory cache
        -   Database cache
-   Database selection
    -   Choose SQL/NewSQL databases for consistency or NoSQL databases for availability and scalability.
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
1.  As more and more user requests hitting the application server, our application server fails to handle them all, probably due to CPU, memory, and connection limit.
    -   We can upgrade the application server to a more powerful machine (vertical scaling).
    -   If that's not enough, we can set up more application servers and a load balancer to handle increasing traffic (horizontal scaling and load balancing).
    -   We can also set up a CDN to cache static assets (caching).
1.  As more and more user data stored in our database, database query speed slows down.
    -   We can upgrade the database server to a more powerful machine (vertical scaling).
    -   Read
        -   If that's not enough, we can put a cache between the application servers and the database to speed up database read operations (caching).
        -   If that's not enough, we can do database replication (database replication).
    -   Write
        -   If that's not enough, we can shard the database into multiple smaller ones to accelerate write operations (database sharding).
1.  As we add more and more features, the application server fails to handle them all, probably due to CPU and memory limit, or dependency conflicts.
    -   We can upgrade the application server to a more powerful machine (vertical scaling).
    -   If that's not enough, we can split the application into multiple services and run each of them in a separate server. We also use an API gateway (or even a cluster of gateways) to route the requests to different services (routing).

## Security

System [security](@/blog/security.md) has become more and more important.

## See also
