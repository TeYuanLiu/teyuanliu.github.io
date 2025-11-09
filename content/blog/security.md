+++
title = "Security"
date = 2025-04-20
updated = 2025-05-04
+++

Software security measures are essential to prevent malicious actions.
<!-- more -->

## Package security

Here are some steps to ensure security when using external packages.

### Pre-run

-   Search for suspicious code in package repository.
    ```bash
    grep -i -E 'requests|http|socket|upload|post|get' -r .
    ```

### Runtime

We can monitor the application's file access pattern and network requests at runtime.

1.  Build a Docker image that contains the application.
    ```bash
    docker build -t <IMAGE_NAME> .
    ```
1.  Start a container using the image (mount a workspace volume if needed).
    ```bash
    docker run -it --rm -v "$PWD/workspace":/workspace <IMAGE_NAME> bash
    ```
1.  Run and monitor the application at runtime.
    -   Inside container
        -   File access
            -   Install and run `strace` to trace file operations when running the application.
                ```bash
                strace -e trace=openat,read,write <APPLICATION>
                ```
            -   Look for file paths outside of `/workspace` to identify suspicious file access.
        -   Network request
            -   Install and run `tcpdump` to monitor network activity.
                ```bash
                sudo tcpdump -i any -n port 80 or port 443
                ```
    -   Outside container
        -   File access
            -   Install and run `inotify` to monitor what files the container accesses.
                ```bash
                inotifywait -m -r $PWD/workspace
                ```
1.  Run the application with restricted access.
    -   Use `--read-only` to prevent write outside volume.
    -   Use `--network=none` to prevent network access.
    -   Use `--cap-drop=ALL` to strip extra privileges.
    -   Use `--security-opt no-new-privileges:true` to prevent privilege escalation.
    ```bash
    docker run --rm -it \
        --read-only \
        --network=none \
        --cap-drop=All \
        --security-opt no-new-privileges:true \
        -v "$PWD/workspace":/workspace \
        <IMAGE_NAME> bash
    ```

## See also
