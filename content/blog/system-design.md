+++
title = "System Design"
date = 2025-04-25
updated = 2025-05-01
+++

Ok, we want to build a software product, but where should we start?

Well, let's first think about what features do we want to support and what is the expected scale. This gives us a long list of questions to answer.
<!-- more -->

## Scope

-   What kind of features should we have?
    -   What's the feature's input?
    -   What's the feature's output?
    -   What's the [database](@/blog/database.md)'s schema?
    -   What's the API's schema?
-   What king of UI should we provide?

## Scale

-   What's the expected traffic scale?
    -   How many total users?
    -   How many concurrent users?
    -   How many write requests per second?
    -   How many read requests per second?
    -   What are the latency and throughput requirement?
-   What's the expected storage scale in 5 years?

## Layout

After clarifying the scope and scale of the system, we move on to sketching out the system layout.

An intuitive and straightforward way is to create one single application that handles the end-to-end workflow. This tightly coupled structure leads us to the monolithic architecture.

### Monolithic

A monolithic system is built as a single, indivisible unit. All components of the system are tightly coupled. 

Because the components reside in the same place, it has several benefits:
-   Development is intuitive as coordination among components is obvious.
-   [Testing](@/blog/testing.md) is easy because the application has one codebase and can be tested end-to-end as a single unit.
-   Deploying, monitoring, and maintaining is straightforward as we can run a single [Docker](@/blog/docker.md) container or Virtual Machine (VM) to host the application with configuration stored as environment variables.
-   Performance like latency is very good since we are doing in-process calls.
-   Data is consistent because we have only one database to interact with.

This architecture well fits use cases like building a prototype. However, as time goes by and the application grows bigger in terms of number of features and users, certain drawbacks gradually emerge:
-   Availability can be greatly impacted by the failure of just one component. One component goes down, the entire application follows it.
-   Scaling independently a specific component, which may require more resources than others, is impossible because everything is bundled as one unit so we are forced to scale all components together. Plus, vertical scaling (upgrading to a more powerful machine) hits certain limit because even the world's most powerful machine has compute and memory constraint.
-   Flexibility is restrained as changing a part of the system requires redeployment of the entire application, not to mention that changing one component can produce bugs in other components.

These downsides bring us to another architecture, microservice.

### Microservice

A microservice architecture breaks down the application into small, loosely coupled and independently deployable services. Each service is responsible for a specific business functionality and communicates with other services through APIs. This is also known as a [distributed system](@/blog/distributed-system.md).

The microservice architecture addresses some of the pain points of the monolithic architecture:
-   Availability is higher as one service's failure doesn't necessarily bring down the whole application.
-   Individual services can be scaled independently based on demand. Horizontal scaling (adding more machines) unlocks the capability of handling large volume of requests.
-   The flexibility of changing each service independently allows more agile development.

However, just like a coin has two sides, the microservice architecture overcomes the monolithic architecture's shortcomings, but struggles to match the monolithic architecture's strengths:
-   Development is more difficult because there are multiple codebases to manage and the coordination among services requires service discovery, load balancing and inter-service communication.
-   Testing is more complicated as we need to test each component's functionality and the integration among services.
-   Deploying, monitoring, and maintaining many services needs robust operation practices and tools.
-   Performance like latency is not great due to the delay brought by communication between services over the network.
-   Data consistency is challenging to maintain across multiple services.

### Hybrid

We can also use a mixture of both. Imagine these two architectures are the two ends of a spectrum, and we can choose somewhere in between. We can apply the microservice architecture to components that need availability, scalability, or flexibility, while grouping others into a monolithic system.

### Comparison

When choosing the architecture for our system, it all comes down to the question: which set of metrics matters to us?

If our product needs high availability, scalability, or flexibility, we probably want something closer to the microservice architecture, otherwise, something similar to the monolithic architecture is probably a better choice.

## Next step

Once we have decided how we structure the application, we can go ahead with the [development cycle](@/blog/development-cycle.md).

## See also
