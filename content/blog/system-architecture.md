+++
title = "System Architecture"
date = 2025-05-02
updated = 2025-12-22
+++

Here we discuss the monolithic architecture, which is a tightly-coupled software running on a single physical server or Virtual Machine (VM) that handles the end-to-end workflow. Then we talk about the microservice architecture, which consists of many services running independently on different servers and connected via a network.
<!-- more -->

## Monolithic

The monolithic architecture is about building a system as a single, indivisible unit. All components of the system are tightly coupled.

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

The microservice architecture breaks down the application into small, loosely coupled, independently deployable microservices. Each service is responsible for a specific business functionality and communicates with other services through APIs.

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

### CAP theorem

The CAP theorem focuses on the consistency, availability, and partition tolerance tradeoff of the microservice architecture. It says we can only achieve two out of the three guarantees at any given time:
-   Consistency (C)
    -   Every request receives either the latest data or an error.
-   Availability (A)
    -   Every request receives a response without error but the response may contain obsolete data.
-   Partition Tolerance (P)
    -   The system continues to operate even if there are network partitions, which means some servers lost connection to others.

In the microservice architecture, partition tolerance is a requirement because network failures happen all the time, so we have to choose between consistency and availability.
-   CP
    -   Preferring consistency over availability, thus the requests hitting the isolated servers fail with an error because the system cannot return the latest data.
-   AP
    -   Preferring availability over consistency, thus the requests hitting the isolated servers receive possibly obsolete data.

### Troubleshooting

Because the microservice architecture brings in the time dimension complexity, we have to deal with race condition issues besides the common misconfiguration or Out-Of-Memory (OOM) issue.

## Tradeoff

To sum up, the microservice architecture provides good:
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

If our product needs high availability, reliability, scalability, or flexibility, we will choose the microservice architecture, otherwise, the monolithic architecture is a better choice.

In reality we often have a fixture of both. We can apply the microservice architecture to components that need availability, reliability, scalability, or flexibility, while grouping others into a monolithic component.

## See also
