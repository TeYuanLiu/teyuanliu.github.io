+++
title = "Docker"
date = 2025-04-20
updated = 2025-05-01
+++

Docker is an open platform for developing, shipping, and running applications.
<!-- more -->

## Features

Feature | Docker | Local
------- | --- | ----
Isolation | Yes | No
Dependency conflict | No | Probable
Security | Higher  | Lower
Version control | Yes | No
Portability | Yes | No
Speed | Slow | Fast
Debug | Hard | easy

## Use case

Use Docker if we need:
-   Isolation for dependency or security
-   Portability for running the application on a different computer

Use case
-   Install and use common dev tools locally.
    -   Editors like `vim`
    -   Utilities like `curl` and `git`
    -   Package managers like `pip` and `nvm`
-   Use Docker for project environments.
    -   Node/Python/Rust apps depending on PostgreSQL and Redis
    -   CUDA/ML apps
-   Develop code on local and connect to established services (DBs, caches, queues) running as containers via `docker-compose`.

## Cost

Using Docker for applications comes with different costs:
-   Time for image building and deployment
-   Money for image transfer and storage
-   Application response latency overhead

### Image size

We can reduce Docker image size by:
-   Include only what's needed.
    -   Multi-stage build
        -   Build stage
            -   Install necessary dependencies and create a standalone executable.
        -   Runtime stage
            -   Copy over the executable from the build stage and set entry-point to it.
        -   Use minimal base image for each stage like slim for build stage, and scratch for runtime stage.
    -   Use .dockerignore to exclude unnecessary files.
    -   Use distroless image.
-   Increase cache utilization.
    -   Optimize layer order.
-   Minimize the number of layers.
    -   Combine multiple run commands together.

Smaller images are nice, but be aware of some possible pitfalls.

For example, we can use the Pyinstaller to bundle the bytecode of your Python application and its dependencies, plus the Python interpreter binary into a single executable, and reduce the image size by 50%. But we may find out that:
-   Some dependencies like the certificate aren't bundled properly and require manual fix. This can grow indefinitely as more dependencies are added to the application.
-   Image build time increases by 82% because the application code and the dependency have to be sorted out, compiled to bytecode, and compressed.
-   Application response latency increases by 8% due to loss of module caching and optimization specific to Python native environment.

Therefore, be mindful of these caveats and consider using this kind of bundler only when image size is the bottleneck of the system.

## Security

Here are some tips to increase security when using Docker:
-   Avoid hardcoding secrets into Dockerfile. Instead, bring in secrets as environment variables or mounted files during runtime.
-   Restrict IP and port access to block dangerous communication.
-   Run the application as a non-root user to reduce security risk even when someone gains access to the container.

## See also
