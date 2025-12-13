+++
title = "Go"
date = 2025-11-30
updated = 2025-12-01
+++

## Here we Go

### Package

A package is a collection of Go files inside the same directory.

### Module

A module is a collection of packages. It is like a project or repository.

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

We can create our first Go program by making a `here_we_go.go` file. Later on during the compile process, the Go compiler first converts this Go file into an assembly-like internal representation and then compiles the internal representation into a binary.

In order to let the compile succeed, there must be a Go file (`here_we_go.go` in our case here) that not only belongs to the `main` package but also includes a `main` function such that the compiler can locate the entrypoint of the binary.

{% codeblocktag () %}
here_we_go.go
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
    // Print a line saying "Here we Go!".
    fmt.Println("Here we Go!")
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
# Run the binary, assuming its name is here-we-go.
./here-we-go
```

Furthermore, we can combine the compile and run into one command `go run`.

```bash
# Generate an ephemeral binary go-buildxxx inside the temporary directory /tmp, running it, and deletes the binary after execution.
go run here_we_go.go 

# This also works as long as the working directory contains the Go file that includes the main package's main function.
go run .
```

## Expression and statement

Feature | Expression | Statement
- | - | -
Purpose | To produce data. | To execute an instruction.
Value returning | Yes | No
Examples | `5; a + b; len(array)` | `x = 5; if ... else ...; for ...; return value; import "fmt"; i++`

## Declaration

Go follows the `<WHAT_TO_DECLARE> <WHAT_NAME> <WHAT_TYPE>` declaration format for many things like variables, functions, types, etc.

## Variable

### Variable declaration

The `var` statement declares a list of variables. It can be at package or function level.

Go uses the `var <VARIABLE_NAME> <VARIABLE_TYPE>` declaration format for variables. This makes variable declaration easier to understand when comparing with C, especially for pointers.

```c
// Declare an integer pointer p in C
int *p
```

```go
// Declare an integer pointer p in Go
var p *int
```

Variables declared without an explicit initial value are given their zero value.
-   `false` for boolean
-   0 for numeric
-   "" for string
-   `null` for pointer

We can declare and initialize a variable at the same time via an explicit declaration or its shorter version. Note that the shorter version is only available within a function and we should use the explicit declaration at the package level.

The shorter version is more commonly used because it is more concise. When using the shorter version, Go can infer the variable type automatically from the value initialized. When the initialization value is an untyped numeric constant, the variable's type is decided by Go based on the precision of the constant. 

```go
// Explicit declaration
var i int = 10  // Note that the int type here can be omitted because we initialize i with a value. 

// Shorter version
i := 10
```

### Primitive type

-   Boolean
    -   bool
-   String
    -   string
-   Integer
    -   int
        -   32-bit or 64-bit based on system type
    -   int8
    -   int16
    -   int32
    -   int64
-   Unsigned integer
    -   uint
        -   32-bit or 64-bit based on system type
    -   uint8
    -   uint16
    -   uint32
    -   uint64
    -   uintptr
        -   32-bit or 64-bit based on system type
-   Floating number
    -   float32
    -   float64
-   Complex number
    -   complex64
    -   complex128
-   Byte
    -   byte (alias of uint8)
-   Rune
    -   rune (alias of int32, representing a Unicode code point)

#### Type conversion

We can use the `T(v)` expression to convert a variable `v` to the type `T`.

```go
// Explicit declaration
var i int = 2
var f float64 = float64(i)

// Shorter versoin
i := 2
f := float64(i)
```

### Array

An array is a contiguous chunk of memory that has a fixed length, so the length is part of its type.

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

A slice is dynamically-sized, flexible view into the elements of an array. When created, it is allocated on the stack.

It contains:
-   A pointer to the first element in the slice
-   The length of the slice
-   The capacity of the slice, which is the number of elements in the underlying array, counting from the first element in the slice

If any slice still holds a pointer to its underlying array, the entire array remains in memory. Therefore, the way to release the array's memory is to set the slice to `nil`.

If our slice is using a small portion of the underlying array, we can use the below methods to cut down memory cost.
-   If the underlying array holds pointers to large data structures, we can explicitly set the pointers to `nil` to let the pointed-to data to be garbage collected, even if the array itself remains.
-   Copy the relevant elements to a new slice with a new underlying array and let the original one to be garbage collected.

#### Slice declaration

A slice literal is like an array literal without the length. During the slice literal declaration, Go creates the underlying array and builds a slice that references it.

We can use the built-in `println` function to learn a slice's information.

```go
// Declare an integer slice. By default its pointer is initialized to nil and both length and capacity are set to 0.
var s []int

// Declare and initialize via a slice literal.
var s = []int{1, 2}

// Shorter version
s := []int{1, 2}

// Declare and initialize a slice with make so it has 2 in length and 4 in capacity. 
// Under the hood, it creates an array with 4 in length and sets the slice's pointer to point to the array's first element.
s = make([]int, 2, 4) 

// Shorter version
s := make([]int, 2, 4)

// Print the slice.
println(s)          // Print [2/4]0xa00001a120, where 2 for length, 4 for capacity, 0xa00001a120 for the pointer.
fmt.Println(len(s)) // Print 2 for length
fmt.Println(cap(s)) // Print 4 for capacity

// Declare and initialize a slice from an existing array
var a [2]int

// The following statements are equivalent.
s := a[:]
s := a[0:]
s := a[:2]
s := a[0:2]
```

#### Slice appending

We can append one or multiple elements or even another slice to the end of a slice. If the slice's capacity is exceeded, meaning the underlying array doesn't have the space to accommodate all elements, Go creates another array (usually doubling the array length), copying the elements into it, and updates the slice to use the new array.

```go
s1 := []int{1}          // s1 = {1}
s1 = append(s1, 2, 3)   // s1 = {1, 2, 3}
s2 := []int{4}          // s2 = {4}
s1 = append(s1, s2...)  // s1 = {1, 2, 3, 4}
```

### Map

A map is used to store key-value pairs. Its zero value is `nil` and has no keys or the ability to accept new keys.

#### Map declaration

```go
// Declare an integer-to-string map. This is meaningless because it's a nil map and cannot accept new keys.
var m map[int]string

// Declare and initialize via a map literal.
var m = map[int]string{1: "one"}

// Shorter version
m := map[int]string{1: "one"}

// Declare a map with make.
m := make(map[int]string)
```

When using a map literal to declare and initialize a map, we can omit the top-level value type if it is a type name.

```go
type Vertex struct {
    X, Y int
}

// Explicit value type
m := map[string]Vertex{
    "Go": Vertex{1, 2},
}

// Shorter version
m := map[string]Vertex{
    "Go": {1, 2},
}
```

#### Map operation

##### Element insertion or update

```go
// Insert or update a key-value pair.
m[key] = value

// Retrieve the value of a key.
value := m[key]

// Delete a key-value pair
delete(m, key)

// Test a key's existence.
value, ok := m[key]
// If the key is in m, ok is true.
// Otherwise, the value is the value type's zero value, and ok is false. 
```

##### Element insertion or update

```go
m[key] = value
```




### Pointer

A pointer is a variable that stores a memory address, usually the memory address of another variable. With a pointer, we can work on a large struct directly inside different functions without the need to copy and pass the object around.

#### Address operator

We can use the address operator `&` to get the memory address of a variable.

```go
i := 2
p := &i
```

#### Dereference operator

We can use the dereference operator `*` to access the pointed-to variable.

```go
i := 2
p := &i
*p = 4  // Now i has value 4.
```

## Constant

### Constant declaration

Go uses the `const <CONSTANT_NAME> <CONSTANT_TYPE>` declaration format for constants. Note that we cannot use the shorter version `:=` to declare a constant.

Numeric constants are high-precision values. An untyped constant takes the type needed by its context.

## Type

### Type declaration

Go uses the `type <TYPE_NAME> <TYPE_TYPE>` declaration format for types.

### Struct

A struct is a collection of fields (variables).

#### Struct declaration

A struct literal denotes a newly allocated struct value by listing the values of its fields.

```go
type Vertex struct {
    X int
    Y int
}

func main() {
    v1 := Vertex{}      // X = 0 and Y = 0 because of default zero-value initialization
    v2 := Vertex{1, 2}  // X = 1 and Y = 2
    v3 := Vertex{X: 3}  // X = 3 and Y = 0    
}
```

#### Struct field access

Struct fields are accessible via a dot. If we have a struct pointer, using a dot does the dereferencing automatically.

```go
type Vertex struct {
    X int
    Y int
}

func main() {
    v := Vertex{1, 2}
    v.X = 3
    p := &Vertex{4, 5}
    p.Y = 6 // Same as (*p).Y = 6
}
```


## Function

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

### Function parameter

When two or more consecutive named function parameters share a type, we can omit the type from all but the last.

```go
// Declare a function add that takes two integer parameters and returns an integer.
func add(x int, y int) int

// Shorter version
func add(x, y int) int
```

### Function return value

A function's return values may be named. If so, they are treated as variables defined at the top of the function. These return value names should be used to document the meaning of the return values. A `return` statement without arguments returns the named return values.

We generally don't use named return value as they can decrease readability in longer functions.

```go
func getXY() (x, y int) {
    x = 1
    y = 2
    return
}
```

### Function value

Functions are values and can be passed around just like other values.

```go
func compute(fn func(float64, float64) float64) float64 {
	return fn(3, 4)
}

func main() {
	hypot := func(x, y float64) float64 {
		return math.Sqrt(x * x + y * y)
	}
	fmt.Println(compute(hypot))
}
```

### Function closure

A closure is a function value that references variables from outside its body. Each closure is bound to its own variable.

### Method

A method is a function attached to a struct using either value or pointer receiver.

-   Value receiver
    -   The method operates on a copy of the struct and is best for read-only operations. It uses the `func (<RECEIVER_NAME> <RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.
-   Pointer receiver
    -   The method operates on the original struct via a pointer pointing to its memory address and is used for write operations. It uses the `func (<RECEIVER_NAME> *<RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.

### Interface

An Interface defines a set of methods, and any struct that implements those methods can be used in a function that accepts the interface, achieving polymorphism (flexibility). 

## Loop

### For loop

A `for` loop has 3 components separated by semicolons.
1.  An initial statement is executed before the first iteration.
1.  A condition expression is evaluated before every iteration.
1.  A post statement is executed at the end of every iteration.

```go
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

i := 0
for i < 10 {
    fmt.Println(i)
    i++
}

// Declare a for loop that runs forever.
for {
    fmt.Println("Here we Go!")
}
```

#### For-range loop

A `for-range` loop provides a concise way to iterate over a range, string, array, slice, map, or channel. The basic syntax assigns iteration values to one or two variables, followed by the `range` keyword and then the collection.

```go
// Loop over both the index and value
for index, value := range collection {}

// Loop over the index
for index := range collection {}

// Loop over the value
for _, value := range collection {}
```

Collection type | First value | Second value (optional)
- | - | -
Integer | Index (int) | Not applicable
String | Index (int) | Rune (Unicode code point)
Array or Slice | Index (int) | Element copy
Map | Key | Value copy
Channel | Element | Not applicable

## Flow control

### If and else

An `if` statement has 2 components separated by a semicolon.
1.  An initial statement is executed first. Its variables stay in the scope of the `if` and `else`.
1.  A condition expression is then evaluated.

```go
if check := true; check == true {
    fmt.Println("Check is true.")
} else if check == false {
    fmt.Println("Check is false.")
} else {
    fmt.Println("Panic: check is not boolean.")
}
```

### Switch

A `switch` statement is a shorter way for flow control. It evaluates cases from top to bottom, and runs the first case whose value is equal to the condition expression.

```go
import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Print("Go runs on ")
	switch os := runtime.GOOS; os {
	case "linux":
		fmt.Println("Linux.")
	case "darwin":
		fmt.Println("macOS.")
    case "windows":
        fmt.Println("Windows.")
	default:
		fmt.Printf("%s.\n", os)
	}
}
```

Switch without condition is the same as `switch true` and is a clean way to write long if-then-else chains.

### Defer

A `defer` statement evaluates its function arguments immediately but postpones the function execution until the `defer` statement's surrounding function returns.

Deferred function calls are pushed onto a stack and follows the Last-In-First-Out (LIFO) execution order.

## Program output

We often use the `Print`, `Println`, and `Printf` function from the built-in `fmt` package.
-   Print
    -   Aggregate passed-in parameters without adding space and new line character as delimiter, and print the result.
-   Println
    -   Aggregate parameters, adding space and new line character, and print the result.
-   Printf
    -   Aggregate parameters based on the passed-in template, without adding space and new line character, and print the result.
    -   `%t` for boolean
    -   `%d` for decimal number
    -   `%g` for floating-point number
    -   `%s` for string
    -   `%v` for object
    -   `%T` for type

## Error handling

Any function call, including arithmetic operation, file read/write, and network request, may fail unexpectedly. Therefore, Go makes functions return two values: the result, and an error. This forces the caller to explicitly handle the potential failure immediately.

The built-in `error` type is an interface that requires an `Error() string` method and is often implemented via `fmt.Errorf()` or `errors.New()`.

## Dependency management

We can use a function from an external package by following the below steps.
1.  Locate the package path via pkg.go.dev.
2.  Import the package into our Go file. Go should add the package as a requirement to the `go.mod` file and produce a `go.sum` file for module authentication.
3.  Run `go mod tidy` to install the package's latest version to the system.

### Exported name

A name is exported if it begins with a capital letter. For example, `Pi` is exported from the `math` package and can be accessed via `math.Pi`.

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to.

## Adoption challenge

-   Goroutine race condition
-   Memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## See also
