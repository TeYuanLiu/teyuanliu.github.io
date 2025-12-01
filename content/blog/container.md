+++
title = "Container"
date = 2025-04-20
updated = 2025-11-26
+++

A container is one process or a group of processes running with its own namespace for process ID (PID), cgroup, mount, user ID (UID), Inter-Process Communication (IPC), network, environment variable, etc. Through these namespace configurations, the container process sees itself as isolated.
<!-- more -->

## Runc

Runc is a low-level runtime that implements the Open Container Initiative (OCI) standard and provides the functionalities for containers to interact with Linux kernel features like cgroup.

## Containerd

Containerd is a high-level runtime that administers the lifecycle of containers including image transfer (no image building), and container supervision (start, stop, restart). It uses runc to implement the Container Runtime Interface (CRI). It supports simple networking like the host mode which allows a container to access the host's network. For more complex networking features we can choose an implementation of the Container Network Interface (CNI) like Calico.

## Ctr

Ctr is a client tool for containerd management.

## CRI-O

CRI-O is another high-level runtime that implements the CRI. It was built for container management on Kubernetes.

## Kubernetes

[Kubernetes](@/blog/kubernetes.md) is a high-level container orchestrator that can use either CRI-O or containerd for CRI.

## Kubectl

Kubectl is a client tool for Kubernetes management.

## Dockerd

Dockerd is a high-level container engine that uses containerd for CRI.

## Docker

Docker is a full-featured image and container management tool. Its Docker engine uses dockerd.

### Dockerfile

Docker can create new Docker images using a Dockerfile and a context. Newer Docker versions on certain OS support building cross-platform images like building arm64 images on amd64 CPU architecture.

### Filesystem layers

When building a container image, the final image is composed of stacked, immutable filesystem layers. Each instruction like `FROM`, `COPY/ADD`, and `RUN` in the Dockerfile produces a new layer. Note that `CMD` and `ENTRYPOINT` don't create filesystem layers but update the image config. Each layer is a tarball of the layer's file changes, stored in `/var/lib/docker/overlay2/` for Docker and `/var/lib/containerd/` for Containerd.

The filesystem layers of an example image look like this:
1.  Read-only image layer (`FROM python`)
1.  Read-only image layer (`COPY requirements .`)
1.  Read-only image layer (`RUN pip install requirements`)
1.  Writable container filesystem
1.  Merged view presented to processes

During the build of each layer:
1.  Docker creates a temporary container from the previous layer.
1.  Execute the command in that container. Note that file deletion is achieved via whiteout to tell lower layers to hide the deleted file.
1.  Capture the filesystem difference and save that as a new compressed layer.
1.  Commit the layer and delete the temporary container.

Layers that already exist in the registry (verified via digest) are not uploaded again during `docker push` so good layering (ordering plus command aggregating) enables small pushes and fast CI/CD.

### Networking

Docker offers 4 drivers to provide container-to-container networking.
-   Bridge enables egress from the container to the host, network, or the internet, but disables ingress access.
-   Host allows the container to share the host's networking configuration.
-   Overlay connects multiple hosts in a Docker Swarm and runs containers to run and communicate with each other on different hosts.
-   Macvlan assigns a MAC address (data-link layer) to a container so it appears as a separate physical network device on the host.

### Docker Compose

Docker Compose is a tool for creating and running applications across multiple containers via YAML file configuration.

### Docker vs local

Feature | Docker | Local
------- | --- | ----
Isolation | Yes | No
Dependency conflict | No | Probable
Security | Higher  | Lower
Version control | Yes | No
Portability | Yes | No
Speed | Slow | Fast
Debug | Hard | easy

#### Use case

Use Docker if we need:
-   Isolation for dependency or security
-   Portability for running the application on a different computer

Use case
-   Install and use common dev tools locally.
    -   Editors like `vim`
    -   Utilities like `curl` and `git`
    -   Package managers like `pip` and `nvm`
-   Develop code locally.
-   Use Docker for component-integration test or system test via `docker-compose`.
    -   Node/Python/Rust apps depending on PostgreSQL and Redis.
    -   CUDA/ML apps

### Cost

Using Docker for applications comes with different costs:
-   Time for image building and deployment
-   Money for image transfer and storage
-   Application response latency overhead

#### Image size

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
    -   Optimize layer order by running dependency installation command first such that code changes don't invalidate the dependency install layer stored in the cache.
-   Minimize the number of layers.
    -   Combine multiple run commands together.

Smaller images are nice, but be aware of some possible pitfalls.

For example, we can use the Pyinstaller to bundle the bytecode of our Python application and its dependencies, plus the Python interpreter binary into a single executable, and reduce the image size by 50%. But we may find out that:
-   Some dependencies like the certificate aren't bundled properly and require manual fix. This can grow indefinitely as more dependencies are added to the application.
-   Image build time increases by 82% because the application code and the dependency have to be sorted out, compiled to bytecode, and compressed.
-   Application response latency increases by 8% due to loss of module caching and optimization specific to Python native environment.

Therefore, be mindful of these caveats and consider using this kind of bundler only when image size is the bottleneck of the system.

### Security

Here are some tips to increase security when using Docker:
-   Avoid hardcoding secrets into Dockerfile. Instead, bring in secrets as environment variables or mounted files during runtime.
-   Restrict IP and port access to block dangerous communication.
-   Run the application as a non-root user to reduce security risk even when someone gains access to the container.

## See also

-   [Containers are chroot with a Marketing Budget](https://earthly.dev/blog/chroot/)
-   [Comparing Container Runtimes: containerd vs. Docker](https://earthly.dev/blog/containerd-vs-docker/)