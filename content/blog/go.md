+++
title = "Go"
date = 2025-11-30
updated = 2026-01-02
+++

Go is a statically typed, compiled programming language. It has fast compilation and concurrency support via goroutines and channels. It uses a garbage collector to manage the heap memory.
<!-- more -->

## Here we Go

### Package

A package is a collection of Go files inside the same directory. Variables, constants, functions, and types defined under the same package are visible across all Go files in the package.

### Module

A module is a collection of packages. It is like a project or repository. A module contains all packages inside its root directory (the directory that has the `go.mod`), including those in the subdirectories, except any subdirectory that contains another `go.mod`, which therefore defines another module.

#### Module initialization

We use `go init mod <MODULE_PATH>` to initialize a module where `<MODULE_PATH>` is the path to our module on a repository platform like GitHub. We usually use a GitHub repository to host a module so the module path is `github.com/<ORGANIZATION>/<REPOSITORY>`. The module path also defines the import path prefix for all packages within the module.

Running the command generates the `go.mod` file that stores the module path and the Go version we are using.
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

#### Expression and statement

A Go file consists of expressions and statements for the computer to read, parse, and execute instructions. Here is a comparison between the expression and statement.

\ | Expression | Statement
-|-|-
Purpose | To produce data | To execute an instruction
Value returning | Yes | No
Examples | `5; a + b; len(array)` | `x = 5; if ... else ...; for ...; return value; import "fmt"; i++`

#### Compile and run

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

## Variable

### Variable declaration

The `var` statement declares a list of variables. It can be at package or function level.

Go uses the `var <VARIABLE_NAME> <VARIABLE_TYPE>` declaration format for variables. This makes variable declaration easier to understand when comparing with C, especially for pointers.

```c
// Declare an integer pointer p in C.
int *p
```

```go
// Declare an integer pointer p in Go.
var p *int
```

Variables declared without an initial value are given their zero value.
-   `false` for boolean
-   `0` for numeric
-   `""` for string
-   `nil` for pointer

We can declare a variable via the explicit way or its shorter version. Note that the shorter version is only available within a function so we must use the explicit way at the package level.

The shorter version is more commonly used because it is more concise. When using the shorter version, Go can infer the variable type automatically from its initial value. When the variable initial value is an untyped numeric constant, the variable type is decided by Go based on the precision of the constant.

```go
// Explicit declaration
var i int = 10  // The int type here can be omitted as Go can infer it from the initial value.

// Shorter version
i := 10
```

### Naming convention

The Go community has the naming convention of PascalCase for exported variables, functions, and camelCase for unexported variables, functions. For example, `Pi` is exported from the `math` package and can be accessed via `math.Pi`.

### Primitive variable type

-   Boolean
    -   bool
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
        -   Use `'<BYTE>'` for literal.
        -   Byte is an alias of uint8 and not int8 because people had already developed the habit of considering 0xFF as 255 not -1. This has increased the difficulty of detecting arithmetic overflow though.
-   Rune
    -   rune (alias of int32, representing a Unicode code point)
        -   Use `'<RUNE>'` for literal.
        -   Rune is an alias of int32 and not uint32 such that arithmetic overflow can be easily detected.
        -   UTF-8
            -   A code point between 0 and 2047 is stored with 2 bytes. The first byte has a 3-bit header `110xxxxx` indicating the character start. The second byte has a 2-bit header `10xxxxxx` marking itself as a continuation byte. The `x` count is 11, and a 11-bit signed integer gives us the range of -2048 to 2047. For example, a code point with value 256 has the first byte as `11000100` and the second byte as `10000000`.
            -   A code point between 2048 and 65535 is stored with 3 bytes. The first byte has a 4-bit header `1110xxxx` indicating the character start. The second and third byte each has a 2-bit header `10xxxxxx` marking as a continuation byte. The `x` count is 16, and a 16-bit signed integer gives us the range of -65536 to 65535. For example, a code point with value 2048 has the first byte as `11100000`, the second byte as `10100000`, and the third byte as `10000000`.
-   String
    -   string
        -   Use `"<STRING>"` for literal.
        -   When working with a string, if you want the rune index as well as the rune value, it is recommended to first turn the string into a rune slice and then process it. If you only need the rune value, a `for _, r := range s {fmt.Printf("%c", r)}` is sufficient.

### Variable type conversion

We can use the `T(v)` expression to convert a variable `v` to the type `T`.

```go
// Explicit declaration
var i int = 2
var f float64 = float64(i)

// Shorter version
i := 2
f := float64(i)
```

### Array

An array is a contiguous chunk of memory that has a fixed length, so the length is part of its type.

If the compiler thinks that an array is only accessed within a specific scope and its memory consumption is small (less than 64KB), it is stored on the stack and freed once out-of-scope.

Otherwise, it is allocated on the heap, which is managed by Go's garbage collector. The Go garbage collector reclaims memory when it sees that an object is no longer reachable by any active part of the program.

#### Array declaration

```go
// Declare an integer array with 2 in length. By default the elements are set to 0.
var a [2]int

// Declare an integer array with an array literal.
var a = [2]int{1, 2}

// Shorter version
a := [2]int{1, 2}

// Declare an integer array with an array literal with length-inferring.
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

If any slice still holds a pointer to its underlying array, the entire array remains in memory. Therefore, the way to release the array's memory is to set the slice to nil.

If our slice is using a small portion of the underlying array, we can use the below methods to cut down memory cost.
-   If the underlying array holds pointers to large data structures, we can explicitly set the pointers to nil to let the pointed-to data to be garbage collected, even if the array itself remains.
-   Copy the relevant elements to a new slice with a new underlying array and let the original one to be garbage collected.

#### Slice declaration

A slice literal is like an array literal without the length. During the slice literal declaration, Go creates the underlying array and builds a slice that references it.

We can use the built-in `println` function to learn a slice's information.

```go
// Declare an integer slice. By default its pointer = nil and length = capacity = 0.
var s []int

// Declare via a slice literal.
var s = []int{1, 2}

// Shorter version
s := []int{1, 2}

// Declare a slice with make so it has 2 in length and 4 in capacity.
// Under the hood, it creates an array with 4 in length and sets the slice's pointer to point to the array's first element.
s = make([]int, 2, 4)

// Shorter version
s := make([]int, 2, 4)

// Print the slice.
println(s)          // Print [2/4]0xa00001a120, where 2 for length, 4 for capacity, 0xa00001a120 for the pointer.
fmt.Println(len(s)) // Print 2 for length
fmt.Println(cap(s)) // Print 4 for capacity

// Declare a slice from an existing array
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

A map is used to store key-value pairs. Its zero value is nil and has no keys or the ability to accept new keys.

#### Map declaration

```go
// Declare an integer-to-string map. This is meaningless because it's a nil map and cannot accept new keys.
var m map[int]string

// Declare via a map literal.
var m = map[int]string{1: "one"}

// Shorter version
m := map[int]string{1: "one"}

// Declare a map with make.
m := make(map[int]string)
```

When using a map literal to declare a map, we can omit the top-level value type if it is a type name.

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

## Print

We often use the `Print`, `Println`, and `Printf` function from the built-in `fmt` package.
-   Print
    -   Aggregate passed-in parameters without adding space and new line character as delimiter, and print the result.
-   Println
    -   Aggregate parameters, adding space and new line character, and print the result.
-   Printf
    -   Aggregate parameters based on the passed-in template, without adding space and new line character, and print the result.
    -   %t for boolean
    -   %d for decimal number
    -   %g for floating-point number
    -   %c for Unicode code point character
    -   %s for string
    -   %v for default format
    -   %T for type
    -   %q for double-quoted string with special character escaping
    -   %w for error
    -   %b for binary
    -   %o for octal (base8)
    -   %x for hexadecimal (base16)

## Flow control

### Loop

#### For loop

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

A `for-range` loop provides a concise way to iterate over a range, string, array, slice, or map. The basic syntax assigns iteration values to one or two variables, followed by the `range` keyword and then the collection.

We can even use this to read a channel. Note that if we want to handle different values received from the channel separately, consider to use the [goroutine select](@/blog/go.md#goroutine-select).

```go
// Loop over the index.
for index := range collection

// Loop over both the index and value.
for index, value := range collection

// Loop over the value.
for _, value := range collection

// Loop over the value received from a channel.
for value := range channel
```

Collection type | First value | Second value (optional)
-|-|-
Integer | Index (int) | Not applicable
String | Index (int) | Rune (Unicode code point)
Array or Slice | Index (int) | Element copy
Map | Key | Value copy
Channel | Element | Not applicable

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

We generally don't use named return values as they can decrease readability in longer functions.

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

A closure is a function value that references variables from outside its body. Each closure is bound to its own external variables.

```go
// fibonacciFactory is a function that returns
// a fibonacci function, which is a closure, that returns
// the next number in the Fibonacci series.
func fibonacciFactory() func() int {
    i, pp, p := -1, 0, 1
    fibonacci := func() int {
        i += 1
        if i == 0 {
            return 0
        } else if i == 1 {
            return 1
        } else {
            c := pp + p
            pp = p
            p = c
            return c
        }
    }
    return fibonacci
}

func main() {
    f := fibonacciFactory()
    for i := 0; i < 10; i++ {
        fmt.Println(f())
    }
}
```

### Method

A method is a function with a special receiver argument. We use the receiver argument to attach the function to a type, usually a struct. Note that the receiver type can't be a pointer and must be defined in the same package so we cannot declare a method with a receiver whose type is `int`.

There are 2 kinds of receivers, the value receiver and the pointer receiver.

-   Value receiver
    -   The method operates on a copy of the receiver and is best for reads on small structs. It uses the `func (<RECEIVER_NAME> <RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format. Note that we can pass in a receiver pointer and Go automatically dereferences the pointer, making a copy of the receiver, and runs the method.
-   Pointer receiver
    -   The method operates on the original receiver via a pointer pointing to the receiver and is used for writes or reads on large structs. It uses the `func (<RECEIVER_NAME> *<RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format. Note that we can pass in a receiver value and Go automatically gets its memory address and runs the method.

### Generic function

A generic function can handle the same parameter of different types using type parameters.

```go
// Declare a function that takes in a T-typed slice `s` and a T-typed variable `x`. The T type can be any type that fulfills the built-in comparable constraint.
// The comparable constraint ensures that we can use a comparison operator like `==` on values of that type.
func getIndex[T comparable](s []T, x T) int
```

## Type

### Type declaration

Go uses the `type <TYPE_NAME> <UNDERLYING_TYPE>` declaration format for types.

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
    v1 := Vertex{}      // By default X = 0 and Y = 0
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

### Interface

An Interface defines a set of method signatures for other types to implement, achieving polymorphism (flexibility).

An interface value is a tuple of a concrete value and the concrete type, and can hold any concrete type value as long as that concrete type implements those methods.

Calling a method on an interface value effectively executes the same-named method of its concrete type value.

```go
type I interface {
    M()
}

func describe(i I) {
    fmt.Printf("(%v, %T)\n", i, i)
}

type T struct {
    S string
}

func (t *T) M() {
    fmt.Println(t.S)
}

func main() {
    var i I
    describe(i) // (nil, nil)
    i.M()       // nil pointer dereference runtime error

    i = &T{"Here we Go!"}
    describe(i) // (&{"Here we Go!"}, *main.T)
    i.M()       // "Here we Go!"
}
```

If the concrete type value inside the interface value is a nil pointer, calling the method will result in a nil pointer dereference runtime error. Therefore, it's a good practice to write code to gracefully handle nil receiver method call.

#### Empty interface

An interface type that specifies no methods is an empty interface. An empty interface can hold values of any concrete type and is used to handle the concrete type value that is unknown at compile time but figured out at runtime.

#### Interface concrete type assertion

An interface concrete type assertion checks if the interface value holds a value of the specified concrete type. If so, it returns the concrete type value and a true ok value. Otherwise, it returns the zero value of the specified concrete type and a false ok value.

#### Interface type switch

An interface type switch is a switch statement that uses types as cases, rather than values as cases.

```go
func do(i interface{}) {
    switch v := i.(type) {
        case int:
            fmt.Printf("Twice %v is %v\n", v, v*2)
        case string:
            fmt.Printf("%q is %v bytes long\n", v, len(v))
        default:
            fmt.Printf("I don't know about type %T!\n", v)
    }
}
```

#### Error interface

The built-in error type is an interface that requires an `Error() string` method. we can use `errors.New()` or `fmt.Errorf()` to quickly build an error value, or we can develop a custom error type.

When implementing the method for a custom error type, we should use `fmt.Sprintf` on the error value's internal fields or the type-converted error value, rather than passing the error value back into the `fmt` function. This makes sure we don't create a recursion that leads to infinite looping.

Any function call, including arithmetic operation, file read/write, and network request, may fail unexpectedly. Therefore, Go makes functions return two values: the result, and an error. This forces the caller to explicitly handle the potential failure immediately.

```go
type MyError struct {
    When time.Time
    What string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("at %v, %s",
        e.When, e.What)
}

func run() error {
    return &MyError{
        time.Now(),
        "it didn't work",
    }
}

func main() {
    if err := run(); err != nil {
        fmt.Println(err)
    }
}
```

#### IO Reader interface

The `io.Reader` interface has a `Read` method that populates the given byte slice with data and returns the number of bytes populated and an error value. It returns an `io.EOF` error when the stream ends.

```go
func (T) Read(b []byte) (n int, err error)
```

#### Image interface

```go
type Image interface {
    ColorModel() color.Model
    Bounds() Rectangle
    At(x, y int) color.Color
}
```

### Generic type

A generic type can hold values of any type.

```go
// List represents a singly-linked list that holds
// values of any type.
type List[T any] struct {
    next *List[T]
    val  T
}
```

## Concurrency

### Goroutine

A goroutine is a lightweight thread managed by the Go runtime.

We can start running a function `f(x)` inside a goroutine using `go f(x)`, The evaluation of `f` and `x` happens in the current goroutine and the execution of `f(x)` happens in the new goroutine.

### Channel

Goroutines shared the same process memory so memory access must be synchronized. This is why we use channels.

A channel is where goroutines synchronize data with each other.

#### Channel declaration

We can use `make` to declare a channel.

```go
ch := make(chan int)
```

#### Channel operation

We can send and receive elements through a channel with the channel operator `<-`.

If we have one sender and that sender has no more elements to send, then it should call `close()` to shutdown the channel.

If we have multiple senders, we should use `sync.WaitGroup` in the coordinator goroutine to wait for all senders to finish before closing the channel. Note that only a sender or coordinator should close the channel because sending to a closed channel causes a panic but receiving from a closed channel doesn't cause a panic.

A receiver can test whether a channel has been closed by assigning a second parameter `ok` to the receive expression. If `ok` is `false` then the channel is closed.

A receiver can use a [for-range loop](@/blog/go.md#for-range-loop) `for i := range c` to receive elements from the `c` channel repeatedly until it is closed. Note that this blocks the receiver goroutine until the channel is closed. This is one of the occasions where we need to close the channel to let the the receiver goroutine be garbage collected. Other than this, we usually don't need to close a channel.

```go
ch <- y         // Send the value of y to channel ch.
x := <-ch       // Receive an element from channel ch and use it to create x.
close(ch)       // A sender closes the ch channel.
z, ok := <-ch   // A receiver checks if the ch channel is closed via the ok variable.
```

Here is an example to use 2 goroutines to sum the numbers in a slice.

```go
func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}

    c := make(chan int)
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    v := 0
    for e := range c {
        fmt.Println(e)
        v += e
    }

    fmt.Println(v)
}
```

Here is a template for common workflows. Note the destructor goroutine that closes the channel to unblock the main function.

```go
type Result struct {
    ID int
    Value int
    Error error
}

func main() {
    results := make(chan Result)
    var wg sync.WaitGroup

    for i := range 3 {
        wg.Go(func() {
            work(i, results)
        })
    }
    go func() {
        wg.Wait()
        close(results)
    }()
    for res := range results {
        fmt.Println(res)
    }
    fmt.Println("finished!")
}

func work(id int, results chan Result) {
    if id % 2 == 0 {
        results <- Result{ID: id, Value: id * 10, Error: nil}
    } else {
        results <- Result{ID: id, Error: errors.New("remainder is 1")}
    }
}
```

#### Channel buffer

A buffer is a channel's internal queue. By default the buffer length is 0, so a send blocks a goroutine until the element it's sending is received by another goroutine. Same for the read, a read blocks a goroutine until another goroutine sends an element to the channel for it to receive.

We can use the second argument of `make` to set the buffer length.

A send doesn't block a goroutine if the number of elements in the channel is less than the buffer length. Otherwise, the send blocks the goroutine. A read works in a similar way.

#### Goroutine select

Goroutine select is used for cases like signal handling alongside receiving values from a channel. The `select` statement pauses the current goroutine until it can execute one of its communication cases. If multiple are ready, it randomly choose one of them to execute.

We can specify a `default` case for it to send or receive without blocking when other cases are not ready yet.

Note that we label the outer loop and break that loop when the result channel is closed.

```go
func main() {
    controls := make(chan string)
    results := make(chan int)
    var wg sync.WaitGroup

    for i := range 3 {
        wg.Go(func() {
            func(id int) {
                results <- id * 10
            }(i)
        })
    }
    go func() {
        wg.Wait()
        close(results)
    }()
    go func() {
        time.Sleep(time.Second * 2)
        controls <- "terminate"
    }()
Loop:
    for {
        select {
            case signal := <- controls:
                if signal == "terminate" {
                    fmt.Println("terminated!")
                    break Loop
                }
            case res, ok := <- results:
                if ok {
                    fmt.Println(res)
                }
            default:
                time.Sleep(time.Millisecond * 1)
        }
    }
    fmt.Println("finished!")
}
```

### Mutex

We use Mutual-exclusion (Mutex) to let a variable be accessed by one goroutine at a time. Go provides the `sync.Mutex` type and its methods, `Lock`, and `Unlock`, to achieve this.

## Context

Contexts propagate cancellation and timeouts across service calls, preventing resource leaks and allowing for graceful shutdowns.

-   context.Context
    -   context.Background()
    -   context.TODO()
    -   context.WithCancel()
    -   context.WithTimeout()

## Networking

-   net/http package for REST API server and client
-   encoding/json package for data serialization/deserialization
-   gopkg.in/yaml.v2 package for parsing YAML

## Command Line Interface (CLI)

-   spf13/cobra package for building CLI tools
-   viper package for reading YAML/JSON configuration files, environment variables, and flags
-   log/slog package for structured logging

## Testing

-   testing package for unit tests

## Dependency management

### Downloading remote modules

In each Go file, we use the `import` keyword to import packages from both local module and remote modules. To download a remote module and record its version in our `go.mod`. We use the `go mod tidy` command to add the missing module and also remove unneeded modules.

If two different modules have packages with the same name, we have to use alias for at least one of the package to avoid conflicting import.

```go
import (
    "example.com/module1/x"
    m2x "example.com/module2/x" // Alias example.com/module2/x to m2x.
)
```

### Removing all downloaded modules

Use `go clean -modcache` to remove all downloaded modules.

## Memory management

### Common memory bugs

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to.

## Adoption challenge

-   Goroutine race condition
-   Memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## References
