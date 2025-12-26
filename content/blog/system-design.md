+++
title = "System Design"
date = 2025-04-25
updated = 2025-12-26
+++

Ok, we want to build a software product, but where should we start?

Well, let's first think about the functional and non-functional requirements of our product. This gives us a list of questions to answer.
<!-- more -->

## Functional requirement (scope)

-   What features do we provide?
-   What does the Application Programming Interface (API) schema look like?
-   What does the storage schema look like?
-   What kind of storage do we use?

## Non-functional requirement

-   Scalability
    -   Traffic
        -   How many users in total?
        -   How many concurrent users at maximum?
        -   How many concurrent writes at maximum?
        -   How many concurrent reads at maximum?
        -   What is the latency requirement?
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

## System layout

After clarifying the functional and non-functional requirements of the system, we move on to sketching out the system layout.

Unless the non-functional requirements demand a system that supports millions or even billions of concurrent users and requests upfront, we want to start with the most basic design.

Forget about microservices, load-balancing, auto-scaling, message queue, async-processing, distributed storage, or big data. We simply don't need them.

When deciding whether we should add a specific component to our system, keep asking ourselves: will anything break if we don't add this component? If nothing actually breaks, that component is something we don't need to include in our system.

This practice minimizes the system complexity and thus the operational cost.

### Basic design

Start with one monolithic server and one database.

In general, CRUD applications are I/O-bound and a server can handle around 10 K Requests Per Second (RPS).

If the application is CPU-bound, the concurrency is limited by the number of logical cores of the server (CPU socket count x physical cores per socket x logical cores per physical core). An enterprise-grade server can have up to 1 K logical cores (8 x 64 x 2).

The basic system design layout looks like the following.

-   Client
-   Server
    -   Business logic
-   Database

### Server bottleneck

As the application gains more users, the server struggles to handle that many concurrent requests and users start to feel the response latency increase. Concurrency becomes the bottleneck of our system due to the OS setting limits or system memory shortage.

#### OS setting limit customization

If the bottleneck is caused by the OS setting limits, we can tune those limits such as the open file descriptor number limit and the TCP stack depth limit. For example, we can lift the open file descriptor number limit from 1 K to 100 K.

#### Server vertical scale up

If the bottleneck is caused by the system memory shortage, we can upgrade the server to a larger instance with more system memory.

#### Server horizontal scale out

If OS setting limit customization and server vertical scale up don't fully resolve the concurrency bottleneck, we then need to horizontally scale out the server to a server cluster. We use a load balancer to distribute the request traffic among the servers.

-   Client
-   Load balancer
-   Server cluster
    -   Server
        -   Business logic
-   Database

### Database bottleneck

As more data is stored in the database and more transactions happen at the same time, the database transaction latency rises to an unacceptable level and becomes the bottleneck of our system.

We can resolve this via [adding a database cache, Content Delivery Network (CDN), and client-side cache](@/blog/database.md#read).

-   Client
    -   Client-side cache
-   CDN
-   Load balancer
-   Server cluster
    -   Server
        -   Business logic
-   Database cache
-   Database

See more about read and write transaction scaling in the [database post](@/blog/database.md).

### Availability and reliability bottleneck

As our monolithic system grows bigger in size, it will face the [availability and reliability challenge](@/blog/system-architecture.md#monolithic). We need to refactor the system to use the microservice architecture. We use an API gateway to filter requests and route them to different services, and for each service we have a load balancer to distribute traffic among many service replicas.

-   Client
    -   Client-side cache
-   CDN
-   API gateway
-   Service
    -   Load balancer
    -   Service replica
        -   Business logic
-   Database cache
-   Database

### External API rate limit bottleneck

If a service depends on an external API and that external API has a rate limit, we can use a message queue to control the request sending rate based on the rate limit in a centralized fashion.

-   Client
    -   Client-side cache
-   CDN
-   API gateway
-   Service
    -   Message queue
    -   Load balancer
    -   Service replica
        -   Business logic
-   Database cache
-   Database

## Tradeoff

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
-   Scalability
    -   Server
        -   Fixed server number vs auto-scaling
        -   Single-region deployment vs multi-region deployment
        -   No rate limit vs rate limit
        -   Fixed quality vs graceful quality degradation
        -   Direct server exposure vs API gateway
        -   Direct server serving vs CDN serving
        -   Polling vs long-polling vs webhooks
        -   Server vs serverless
        -   Stateful vs stateless
            -   Stateless services don't store user data like user sessions inside their own storage. User data is stored in a centralized storage such that users can have the same session despite hitting different service replicas. This makes services easier to scale horizontally.
        -   Server-side caching vs client-side caching
        -   Batch processing vs stream processing

## Next step

Once we have decided how we structure the system, we can go ahead with the [development cycle](@/blog/development-cycle.md).

## See also
