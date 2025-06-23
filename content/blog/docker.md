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

### Use case

Use Docker if we need:
-   Isolation for dependency or security
-   Portability for running the application on a different computer

Use case
-   Install and use common dev tools locally.
    -   Editors like `vim`.
    -   Utilities like `curl` and `git`
    -   Package managers like `pip` and `nvm`
-   Use Docker for project environments.
    -   Node/Python/Rust apps depending on PostgreSQL and Redis
    -   CUDA/ML apps
-   Develop code on local and connect to established services (DBs, caches, queues) running as containers via `docker-compose`.

## See also
