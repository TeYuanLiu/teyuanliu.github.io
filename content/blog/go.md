+++
title = "Go"
date = 2025-11-30
updated = 2025-12-01
+++

## 

## Execution flow

1.  Go compiler first converts Go files into an assembly-like internal representation and then compiles the internal representation into a binary.
1.  The machine executes the binary.

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to. Some examples are listed below.
        -   Dereferencing a null pointer

## Dependency management

### Package

A Go package is a collection of Go files inside the same directory.

### Module

A Go module is a collection of packages. It is like a project.

We use `go init mod <REPOSITORY_PATH>` to initialize a module where `<REPOSITORY_PATH>` is usually something like `github.com/<ORGANIZATION>/<REPOSITORY>`. Running the command generates a `go.mod` file in which stores the `<REPOSITORY_PATH>` and the command's Go version. 

### Main

A Go module must have a `main` package that contains a `main` function that serves as the compiled binary's entrypoint.

Running `go build` compiles the Go files inside the current working directory into a binary named after the directory  name.

## See also
