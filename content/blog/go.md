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

### First Go program

We can create our first Go program by making a `hello.go` file. Later on during the compile process, the Go compiler first converts this Go file into an assembly-like internal representation and then compiles the internal representation into a binary.

In order to let the compile succeed, there must be a Go file (`hello.go` in our case here) that not only belongs to the `main` package but also includes a `main` function such that the compiler can locate the entrypoint of the binary.

{% codeblocktag () %}
hello.go
{% end %}
```go
// Declare this file as part of the main package.
package main

// Import the built-in fmt package for input/output.
import (
"fmt"
)

// Declare the main function in the main package.
func main() {   
    // Print a line saying "Hello, Go!".
    fmt.Println("Hello, Go!")
}
```

### Compile and run

We can use the `go build` command to instruct the Go compiler to compile the working directory's Go files into a binary.

```bash
# Generate a binary that has the same name as the working directory.
go build
```

And then we can run the produced binary.

```bash
# Run the binary, assuming its name is hello-go.
./hello-go
```

Furthermore, we can combine the compile and run into one command `go run`.

```bash
# Generate an ephemeral binary go-buildxxx inside the temporary directory /tmp, running it, and deletes the binary after execution.
go run hello.go 

# This also works as long as the working directory contains the Go file that includes the main package's main function.
go run .
```

## Declaration

Go follows the `<WHAT_TO_DECLARE> <WHAT_NAME> <WHAT_TYPE>` declaration format for many things like variables, functions, structs, etc.

### Variable declaration

Go uses the `var <VARIABLE_NAME> <VARIABLE_TYPE>` declaration format for variables. This makes variable declaration easier to understand when comparing with C, especially for pointers.

```c
// Declare an integer pointer p in C
int *p
```

```go
// Declare an integer pointer p in Go
var p *int
```

We can declare and assign a variable at the same time via an explicit declaration or its shorter version.

The shorter version is more commonly used because it is more concise. When using the shorter version, Go can infer the variable type automatically if the value assigned is a primitive data type like integer.

```go
// Explicit declaration
var i int = 10

// Shorter version
i := 10
```

### Function declaration

Go uses the `func <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format for functions. This is also easier to understand comparing with C.

```c
// Declare a function f that takes an integer parameter and returns an integer in C.
int f(int p)
```

```go
// Declare a function f that takes an integer parameter and returns an integer in Go.
func f(p int) int
```

## Data type

### Array

A Go array is a contiguous chunk of memory that has a fixed size.

If the compiler thinks that an array is only accessed within a specific scope and its memory consumption is small (less than 64KB), it is stored on the stack and freed once out-of-scope.

Otherwise, it is allocated on the heap, which is managed by Go's garbage collector. The Go garbage collector reclaims memory when it sees that an object is no longer reachable by any active part of the program.

#### Array declaration

```go
// Declare an integer array with 2 in length. By default the elements are initialized to 0.
var a [2]int

// Declare and initialize an integer array with a literal.
var a = [2]int{1, 2}

// Shorter version
a := [2]int{1, 2}

// Declare and initialize an integer array with a literal and length-inferring.
var a = [...]int{1, 2}

// Shorter version
a := [...]int{1, 2}
```

### Slice

A Go slice is a lightweight data structure allocated on the stack that describes a contiguous segment of an underlying array.

It contains:
-   A pointer to the slice's starting point in the array
-   The length of the slice
-   The capacity of the slice, which is the length of the array starting from the slice's starting point

If any slice still holds a pointer to its underlying array, the entire array remains in memory. Therefore, the way to release the array's memory is to set the slice to `nil`.

If our slice is using a small portion of the underlying array, we can use the below methods to cut down memory cost.
-   If the underlying array holds pointers to large data structures, we can explicitly set the pointers to `nil` to let the pointed-to data to be garbage collected, even if the array itself remains.
-   Copy the relevant elements to a new slice with a new underlying array and let the original one to be garbage collected.

#### Slice declaration

```go
// Declare an integer slice. By default its pointer is initialized to nil.
var s []int

// Declare and initialize an integer slice with a literal.
var s = []int{1, 2}

// Shorter version
s := []int{1, 2}

// Declare and initialize a slice with make so it has 2 in length and 4 in capacity. 
// Under the hood, it creates an array with 4 in length and sets the slice's pointer to point to the start of the array.
s = make([]int, 2, 4) 

// Shorter version
s := make([]int, 2, 4)

// Declare and initialize a slice from an existing array
var a [2]int
s := a[:]
```

#### Slice appending

We can append one or multiple elements or even another slice to the end of a slice. If the slice's capacity is exceeded, meaning the underlying array doesn't have the space to accommodate all elements, Go creates another array (usually doubling the array length), copying the elements into it, and updates the slice to use the new array.

We can use the built-in `println` function to learn a slice's information.

```go
s := make([]int, 2, 4)
println(s)
// Print [2/4]0xa00001a120, where 2 for length, 4 for capacity, 0xa00001a120 for slice pointer.
```

### Map

A map is used to store key-value pairs.

#### Map declaration

```go
// Declare an integer-to-string map.
var m map[int]string

// Declare and initialize a map with a literal.
var m = map[int]string{1: "one"}

// Shorter version
m := map[int]string{1: "one"}

// Declare a map with make.
m := make(map[int]string)
```

### Struct

A struct is a collection of variables.

#### Method

A method is a function attached to a struct using either value or pointer receiver.

-   Value receiver
    -   The method operates on a copy of the struct and is best for read-only operations. It uses the `func (<RECEIVER_NAME> <RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.
-   Pointer receiver
    -   The method operates on the original struct via a pointer pointing to its memory address and is used for write operations. It uses the `func (<RECEIVER_NAME> *<RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.

### Interface

An Interface defines a set of methods, and any struct that implements those methods can be used in a function that accepts the interface, achieving polymorphism (flexibility). 

### Pointer

A pointer is a variable that stores a memory address, usually the memory address of another variable. With a pointer, we can work on a large struct directly inside different functions without the need to copy and pass the object around.

#### Address operator

We can use the address operator `&` to get the memory address of a variable.

```go
var i int = 2
var p *int = &i
```

#### Dereference operator

We can use the dereference operator `*` to access the pointed-to variable.

```go
i := 2
var p *int = &i
*p = 4  // Now i has value 4.
```

## Error handling

Any function call, including arithmetic operation, file read/write, and network request, may fail unexpectedly. Therefore, Go makes functions return two values: the result, and an error. This forces the caller to explicitly handle the potential failure immediately.

The built-in `error` type is an interface that requires an `Error() string` method and is often implemented via `fmt.Errorf()` or `errors.New()`.

## Dependency management

We can use a function from an external package by following the below steps.
1.  Locate the package path via pkg.go.dev.
2.  Import the package in our Go file. Do should add the package as a requirement to the `go.mod` file and produce a `go.sum` file for module authentication.
3.  Run `go mod tidy` to install the package's latest version to the system.

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to.

## Adoption challenge

-   Goroutine race condition
-   Memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## See also
