+++
title = "Go"
date = 2025-11-30
updated = 2025-12-01
+++

## Hello Go

### Package

A Go package is a collection of Go files inside the same directory.

### Module

A Go module is a collection of packages. It is like a project or repository.

#### Module initialization

We use `go init mod <MODULE_PATH>` to initialize a module where `<MODULE_PATH>` is the path to our module on a repository platform like GitHub. We usually use a GitHub repository to host a module so the module path is `github.com/<ORGANIZATION>/<REPOSITORY>`.

Running the command generates a `go.mod` file that stores the module path and the Go version we are using.
{% codeblocktag () %}
go.mod
{% end %}
```config
module <MODULE_PATH>
go <VERSION>
```

### First Go file

We can create our first Go program by making a `hello.go` file. Later on during the compile process, the Go compiler first converts this Go file into an assembly-like internal representation and then compiles the internal representation into a binary.

In order to let the compile succeed, there must be a Go file (`hello.go` in our case here) that not only belongs to the `main` package but also includes a `main` function such that the compiler can locate the entrypoint of the binary.

{% codeblocktag () %}
hello.go
{% end %}
```go
package main    // Declares that this file belongs to the main package.

import (
"fmt"   // Imports the built-in fmt package for input/output.
)

func main() {   // Declares the main function in the main package.
    fmt.Println("Hello, Go!")   // Prints a line saying "Hello, Go!".
}
```

### Compile and run

We can use the `go build` command to instruct the Go compiler to compile the working directory's Go files into a binary.

```bash
# Compile
go build    # Generates a binary that has the same name as the working directory. Assumes it is called hello-go.

# Run
./hello-go
```

Furthermore, we can combine the compile and run into one command `go run`.

```bash
# Compile and run
go run hello.go # Generates an ephemeral binary go-buildxxx inside the temporary directory /tmp, running it, and deletes the binary after execution.
```

## Declaration

Go follows the `<WHAT_TO_DECLARE> <WHAT_NAME> <WHAT_TYPE>` declaration format for many things like variables, functions, types, etc.

### Variable declaration

Go uses the `var <VARIABLE_NAME> <VARIABLE_TYPE>` declaration format for variables. This makes variable declaration easier to understand when comparing with C, especially for pointers.

```c
// Integer pointer p in C
int *p
```

```go
// Integer pointer p in Go
var p *int
```

#### Variable declaration plus assignment

We can declare and assign a variable at the same time in Go via either the explicit or the concise and more popular way, where Go infers the variable type automatically.

```go
// The explicit way.
var i int = 10

// The concise and more popular way.
i := 10
```

### Function declaration

Go uses the `func <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format for functions. This is also easier to understand comparing with C.

```c
// Function f that takes an integer parameter and returns an integer in C
int f(int p)
```

```go
// Function f that takes an integer parameter and returns an integer in Go
func f(p int) int
```

### Array and slice

## Dependency management

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to.

## Adoption challenge

-   Goroutine race condition
-   Memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## See also
