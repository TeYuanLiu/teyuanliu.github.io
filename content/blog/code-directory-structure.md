+++
title = "Code directory structure"
date = 2025-11-20
updated = 2026-11-20
+++

How to organize a codebase for better maintainability? Let's find out.
<!-- more -->

## Maintainability

-   Minimum time to know which file and which part of the file to change

## Layer

-   Model
    -   Define the business entity data structures (e.g., a stock class has properties like symbol and company name).
-   Infrastructure
    -   Define the infrastructure implementations (e.g., PostgreSQL).
-   Port
    -   Define the infrastructure abstractions which are implemented in the infrastructure layer (e.g., database abstraction).
-   Service
    -   Define the business logic functions that manipulates models and infrastructure abstractions.
    -   Take infrastructure abstractions and store them as internal attributes instead of passing them as method parameters to reduce infrastructure-change complexity.
-   Handler
    -   Take service object pointers as dependencies.
    -   Decode request, calling the service object methods, and send response. We don't perform business logic inside the handler to lower handler switching difficulty.

## Main

The main entrypoint creates infrastructure and service instances, injecting dependencies, and starts the handler.

## Layer-based organization

```bash
cmd/
    main.go
internal/
    model/
        stock.go
        notification.go
    infrastructure/
        database/
            postgresql.go
            sqlite.go
    port/
        database.go
    service/
        stock.go
        notification.go
    handler/
        rest.go
        grpc.go
```

-   Adding or fixing one specific feature requires navigation across all layer directories.

Metric | Method
-|-
Search | Worse

## Functionality-based organization

```bash
cmd/
    main.go
internal/
    stock/
        model.go
        service.go
        port.go
    notification/
        model.go
        service.go
        port.go
    infrastructure/
        database/
            postgresql.go
            sqlite.go
    handler/
        rest.go
        grpc.go
```

-   Group functionalities with shared models under the same functionality directory to avoid code duplication or extra import dependency.

Metric | Method
-|-
Search | Better

## References
