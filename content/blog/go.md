+++
title = "Go"
date = 2025-11-30
updated = 2025-12-01
+++

## 

## Execution flow

### Package

A Go package is a collection of Go files inside the same directory.

### Module

A Go module is a collection of packages. It is like a project.

#### Module initialization

We use `go init mod <MODULE_PATH>` to initialize a module where `<MODULE_PATH>` is the path to our module on a repository platform like GitHub. We usually use one GitHub repository to host a module so the module path is `github.com/<ORGANIZATION>/<REPOSITORY>`.

Running the command generates a `go.mod` file that stores the module path and the Go version we are using.
{% codeblocktag () %}
go.mod
{% end %}
```config
module <MODULE_PATH>
go <VERSION>
```

### Compile and run

The Go compiler first converts Go files into an assembly-like internal representation and then compiles the internal representation into a binary.

We can use the `go build` command to instruct the Go compiler to compile the Go files in the working directory into a binary, and then run the binary.

```bash
# Compile
ls # Prints go.mod main.go
go build # Generates a binary that has the same name as the working directory. Assumes it is called hello-go.
ls # Prints go.mod main.go hello-go

# Run
./hello-go
```

Note that we must have a Go file that not only belongs to the `main` package but also includes a `main` function for the compile to succeed. Otherwise, the compiler cannot locate the entrypoint of the binary, leading to compile failure.

We can combine the compile and run into one command `go run`.

```bash
# Compile and run
ls # Prints go.mod main.go
go run main.go # Generates an ephemeral binary go-buildxxx inside the temporary directory /tmp, running it, and deletes the binary after execution.
ls # Prints go.mod main.go
```

## Dependency management

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to. Some examples are listed below.
        -   Dereferencing a null pointer

## Adoption challenge

-   Goroutine race condition
-   Memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## See also
