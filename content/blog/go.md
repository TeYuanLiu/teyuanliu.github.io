+++
title = "Go"
date = 2025-11-30
updated = 2026-06-17
+++

Go is a statically typed, compiled programming language. It has fast compilation and concurrency support via goroutines and channels. It uses a garbage collector to manage the heap memory.
<!-- more -->

## File

### File naming

We use snake_case for Go file names.

Due to compatibility across case-sensitive OS like Linux and case-insensitive OS like Windows and MacOS, it's safer to use lowercase in every name.

Because the Go compiler uses underscores for special file suffixes to control the build process (`*_test.go` for test file and `*_linux.go` for Linux-only compiling), it's idiomatic to use underscores to group words together, and we arrive at the conclusion of using snake_case for Go files.

We use kebab-case for every other kind of files for example compiled binaries, such that they are consistent with other shell tools.

### Expression and statement

A Go file consists of expressions and statements for the computer to read, parse, and execute instructions. Here is a comparison between the expression and statement.

\ | Expression | Statement
-|-|-
Purpose | To produce data | To execute an instruction
Value returning | Yes | No
Examples | `5; a + b; len(array)` | `x = 5; if ... else ...; for ...; return value; import "fmt"; i++`

## Package

A package defines a code namespace.

The scope of the namespace includes all Go files inside the same directory so placing 2 Go files with different package declaration in the same directory leads to compilation failure.

All variables, constants, functions, and types defined within the namespace have access to each other. They are inaccessible from any file outside of the package, unless the object name is marked as exported by capitalizing its name, and inside the file there is an `import` statement which imports the package and thus the object.

A package has the below 2 attributes.

-   Package name
    -   The package name is the unique identifier of a package.
    -   A package name should use the lowercase single word format, so a `user service` package becomes `userservice`.
    -   Each Go file has a `package <PACKAGE>` statement at its top to declare its package and thus label its content with that package.
    -   The compiler reads the `<PACKAGE_NAME>.<EXPORTED_OBJECT>` expression in a Go file of a target package to locate and call a source package's exported objects.
-   Package path
    -   The package path is the unique address of a package and is usually the joining of its module path and the package directory path relative to the module root.
    -   The compiler reads the `import <PACKAGE_NAME> <PACKAGE_PATH>` statement in our code to locate a package.
    -   The package directory name is independent of the package name.
        -   Here are 2 situations in which the package directory name is different from the package name.
            -   `main`
                -   The compiler demands the entrypoint file to declare package `main` even though it is often placed at somewhere like the project root, `cmd/server/`, or `cmd/cli/`, rather than a `main/` directory.
            -   `*_test`
                -   We put Go files for external testing alongside application code. To ensure the tests only interact with public APIs, we declare the external test package as `package <PACKAGE>_test` even though it lives inside the `<PACKAGE>/` directory.
        -   Below is another example.
            ```bash
            <REPOSITORY>/
                go.mod
                directory1/
                    package1.go
                directory2/
                    package2.go
            ```
            \
            {% codeblocktag () %}
            package1.go
            {% end %}
            ```go
            package package1
            var Package1Var = 1
            ```
            \
            {% codeblocktag () %}
            package2.go
            {% end %}
            ```go
            package package2
            import package1 "github.com/<ORGANIZATION>/<REPOSITORY>/directory1"
            func Package2Func() {
                println(package1.Package1Var)
            }
            ```
        -   Go rewards the convention of naming the package directory after the package by letting us omit the `<PACKAGE_NAME>` part in the import statement so `import <PACKAGE_NAME> <PACKAGE_PATH>` becomes `import <PACKAGE_PATH>` and we can still use `<PACKAGE_NAME>.<EXPORTED_OBJECT>` to call an exported package object.
    -   Packages inside an `internal` directory are private and cannot be imported by code outside of the module.

## Module

A module is a collection of packages. It is like a project or repository. A module contains all packages inside its root directory (the directory that has the `go.mod`), including those in the subdirectories, except any subdirectory that contains another `go.mod`, which therefore defines another module.

### Module initialization

We use `go mod init <MODULE_PATH>` to initialize a module where `<MODULE_PATH>` is the path to our module on a repository platform like GitHub. We usually use a GitHub repository to host a module so the module path is `github.com/<ORGANIZATION>/<REPOSITORY>`. The module path also defines the import path prefix for all packages within the module.

Running the command generates the `go.mod` file that stores the module path and the Go version we are using.
{% codeblocktag () %}
go.mod
{% end %}
```config
module <MODULE_PATH>
go <VERSION>
```

## Workspace

A workspace is a local configuration layer that intercepts remote imports and redirects them to specific local directories such that local changes can be recognized. This is very useful when we have multiple Go modules inside the same repository as it eliminates the need for a temporary `replace` statement inside the `go.mod` file of a dependent module during local development.

### Workspace initialization

A workspace is defined in a `go.work` file.

At the repository root, we first initialize each module inside the repository, and then initialize the workspace.

```bash
cd <MODULE_1>
go mod init github.com/<ORGANIZATION>/<REPOSITORY>/<MODULE_1>
cd ../<MODULE_2>
go mod init github.com/<ORGANIZATION>/<REPOSITORY>/<MODULE_2>
cd ..
go work init ./<MODULE_1> ./<MODULE_2>
```

The generated `go.work` is like the following.
{% codeblocktag () %}
go.work
{% end %}
```config
go <VERSION>

use (
    ./<MODULE_1>
    ./<MODULE_2>
)
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

### Variable naming convention

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
-   Rune
    -   rune (alias of int32, representing a Unicode code point)
-   String
    -   string

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

### Byte

-   Use `'<BYTE>'` for literal.
-   Byte is an alias of uint8 and not int8 because people had already developed the habit of considering 0xFF as 255 not -1. This has increased the difficulty of detecting arithmetic overflow though.

### Rune

-   Use `'<RUNE>'` for literal.
-   Rune is an alias of int32 and not uint32 such that arithmetic overflow can be easily detected.
-   UTF-8
    -   A code point between 0 and 2047 is stored with 2 bytes. The first byte has a 3-bit header `110xxxxx` indicating the character start. The second byte has a 2-bit header `10xxxxxx` marking itself as a continuation byte. The `x` count is 11, and a 11-bit signed integer gives us the range of -2048 to 2047. For example, a code point with value 256 has the first byte as `11000100` and the second byte as `10000000`.
    -   A code point between 2048 and 65535 is stored with 3 bytes. The first byte has a 4-bit header `1110xxxx` indicating the character start. The second and third byte each has a 2-bit header `10xxxxxx` marking as a continuation byte. The `x` count is 16, and a 16-bit signed integer gives us the range of -65536 to 65535. For example, a code point with value 2048 has the first byte as `11100000`, the second byte as `10100000`, and the third byte as `10000000`.

### String

-   Use `"<STRING>"` for literal.
-   When working with a string, if we want the rune index as well as the rune value, it is recommended to first turn the string into a rune slice and then process it. If you only need the rune value, a `for _, r := range s {fmt.Printf("%c", r)}` is sufficient.
-   A string variable is stored as a pointer pointing to its data and length, so we should almost always pass it by value.
-   A string is immutable whereas a byte slice is mutable. Converting one to the other causes a copy so it's better to stick with one representation and be consistent.

#### String concatenation

-   fmt.Sprintf (worst heap allocation)
    ```go
    func concatenateStrings(a, b string) string {
        return fmt.Sprintf("%s%s", a, b)
    }
    ```
    -   Go creates an `any` slice from the string parameters, getting a printer from the printer sync pool, using its method to parse the format verbs, writing the formatted data into the printer's internal buffer, and copy from the buffer to a final string.
    -   New heap allocations per function call are the final string and the `any` slice for the string parameters. The printer sync pool cost on heap is amortized among function calls.
-   Byte buffer sync pool (worse heap allocation)
    ```go
    var bufferPool = sync.Pool{
        New: func() any {return &bytes.Buffer{}},
    }

    func concatenateStrings(a, b string) string {
        buffer := bufferPool.Get().(*bytes.Buffer)
        buffer.Reset()
        defer bufferPool.Put(buffer)
        buffer.WriteString(a)
        buffer.WriteString(b)
        return buffer.String()
    }
    ```
    -   Go creates a byte buffer sync pool, getting a buffer from the pool, writing the string parameters to the buffer, and copy from the buffer to a final string.
    -   New heap allocation per function call is the final string. The byte buffer sync pool cost on heap is amortized among function calls.
-   [String builder](https://github.com/golang/go/blob/master/src/strings/builder.go#L17) with predefined length (good heap allocation)
    ```go
    func concatenateStrings(a, b string) string {
        var sb strings.Builder
        sb.Grow(len(a) + len(b))
        sb.WriteString(a)
        sb.WriteString(b)
        return sb.String()
    }
    ```
    -   Go creates a string builder, growing its internal byte slice to the predefined length, writing from the string parameters to it, and uses `unsafe` to return its internal byte slice.
    -   New heap allocation per function call is the string builder struct which includes its internal byte slice.
-   Direct concatenation (best heap allocation)
    ```go
    func concatenateStrings(a, b string) string {
        return a + b
    }
    ```
    -   Go creates a string slice from the string arguments on the stack (which is way cheaper than heap allocation) and calls [runtime.concatstrings](https://github.com/golang/go/blob/master/src/runtime/string.go#L29) to calculate the total length, creating a byte buffer for the final string, and write from the slice to it.
    -   New heap allocation per function call is the byte buffer.

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

Because a slice is lightweight and super cheap to copy, we usually pass it around by value.

If any slice still holds a pointer to its underlying array, the entire array remains in memory. Therefore, the way to release the array's memory is to set the slice to nil.

If our slice is using a small portion of the underlying array, we can use the below methods to cut down memory cost.
-   If the underlying array holds pointers to large data structures, we can explicitly set the pointers to nil to let the pointed-to data be garbage collected, even if the array itself remains.
-   Copy the relevant elements to a new slice with a new underlying array and let the original one be garbage collected.

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

If we know the exact capacity needed, or even just an estimate, we can preallocate the slice capacity and save the work for multiple array recreations.

```go
s1 := []int{1}          // s1 = {1}
s1 = append(s1, 2, 3)   // s1 = {1, 2, 3}
s2 := []int{4}          // s2 = {4}
s1 = append(s1, s2...)  // s1 = {1, 2, 3, 4}
```

#### Byte slice generation

-   Direct allocation (worse heap allocation)
    ```go
    func encodeData(data map[string]string) ([]byte, error) {
        buffer := &bytes.Buffer{}
        err := json.NewEncoder(buffer).Encode(data)
        if err != nil {
            return nil, err
        }
        return buffer.Bytes(), nil
    }
    ```
    -   Go creates a byte buffer, writing the data to the buffer, and returns the buffer byte slice.
    -   New heap allocation per function call is the byte buffer.
-   Byte buffer sync pool (good heap allocation)
    ```go
    var bufferPool = sync.Pool{
        New: func() any {return &bytes.Buffer{}},
    }

    func encodeData(data map[string]string) ([]byte, error) {
        buffer := bufferPool.Get().(*bytes.Buffer)
        buffer.Reset()
        defer bufferPool.Put(buffer)
        err := json.NewEncoder(buffer).Encode(data)
        if err != nil {
            return nil, err
        }
        return buffer.Bytes(), nil
    }
    ```
    -   Go creates a byte buffer sync pool, getting a buffer from the pool, writing the string to the buffer, and sends the buffer byte slice to the writer.
    -   New heap allocation per function call is zero. The byte buffer sync pool cost on heap is amortized among function calls.
    -   Its use cases include byte buffers, JSON encoders, request structs, and protobuf scratch space.

#### String slice concatenation

-   Direct concatenation (worst heap allocation)
    ```go
    func concatenateStrings(strs []string) string {
        final := strs[0]
        for i = 1; i < len(strs); i++ {
            final += strs[i]
        }
        return final
    }
    ```
    -   In each iteration of the for loop, Go creates a string slice from the last `final` and `strs[i]` on stack, and calls `runtime.concatstrings` to calculate the total length, creating a byte buffer for the current `final`, and write from the slice to it.
    -   New heap allocations per function call are the byte buffers created for all iterations.
-   Byte buffer sync pool (good heap allocation)
    ```go
    var bufferPool = sync.Pool{
        New: func() any {return &bytes.Buffer{}},
    }

    func concatenateStrings(strs []string) string {
        buffer := bufferPool.Get().(*bytes.Buffer)
        buffer.Reset()
        defer bufferPool.Put(buffer)
        for _, s := range strs {
            buffer.WriteString(s)
        }
        return buffer.String()
    }
    ```
    -   Go creates a byte buffer sync pool, getting a buffer from the pool, writing the strings to the buffer in a for loop, and copy from the buffer to a final string.
    -   New heap allocation per function call is the final string. The byte buffer sync pool cost on heap is amortized among function calls.
-   [Strings join](https://github.com/golang/go/blob/master/src/strings/strings.go#L470) which is using string builder with predefined length under the hood (best heap allocation)
    ```go
    func concatenateStrings(strs []string) string {
        return strings.Join(strs)
    }

    func concatenateStrings(strs []string) string {
        var sb strings.Builder
        l := 0
        for _, s := range strs {
            if l > maxInt - len(s) {
                panic("final string length too large")
            }
            l += len(s)
        }
        sb.Grow(l)
        for _, s := range strs {
            sb.WriteString(s)
        }
        return sb.String()
    }
    ```
    -   Go creates a string builder, growing its internal byte slice to the predefined length, writing from the string slice to it with a for loop, and uses `unsafe` to return its internal byte slice.
    -   New heap allocation per function call is the string builder struct which includes its internal byte slice.

### Heap

We can use the `container/heap` package to implement a min heap. It requires us to implement the `Len`, `Less`, `Swap`, `Push`, and `Pop` function for the `container/heap` package to use.

```go
type IntHeap []int

func (h IntHeap) Len() int {
    return len(h)
}

func (h IntHeap) Less(i, j int) bool {
    return h[i] < h[j]
}

func (h IntHeap) Swap(i, j int) {
    h[i], h[j] = h[j], h[i]
}

func (h *IntHeap) Push(x any) {
    *h = append(*h, x.(int))
}

func (h *IntHeap) Pop() any {
    n := len(*h)
    last := (*h)[n - 1]
    *h = (*h)[: n - 1]
    return last
}

func main() {
    h := &IntHeap{}
    heap.Init(h)
    heap.Push(h, 1)
    s := heap.Pop(h)
}
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

## Printing

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
    -   %q for double-quoted string with special character escaping
    -   %p for pointer
    -   %T for type
    -   %w for error
    -   %b for binary
    -   %o for octal (base8)
    -   %x for hexadecimal (base16)
    -   %v for default format

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

We should avoid calling deferred function inside a for loop because all deferred function calls will stack on each other and accumulate resource usage. Instead, we should move the loop body which includes the deferred function call into its own function and call this function inside the for loop.

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

When a function returns a value, it copies the value from the variable within the function and passes it to the outer world.

```go
func main() {
    value := returnValue()
	fmt.Printf("value stored at %p\n", &value) // memory address 2
}

func returnValue() bool {
	value := true
	fmt.Printf("value stored at %p\n", &value) // memory address 1
	return value
}
```

The same holds for pointer returning. But note that `value` now lives on the heap instead of stack for access across different frames on the call stack.

```go
func main() {
	pointer := returnPointer()
	fmt.Printf("pointer pointing to %p\n", pointer) // memory address 1
	fmt.Printf("pointer stored at %p\n", &pointer)  // memory address 3
}

func returnPointer() *bool {
	value := true
	pointer := &value
	fmt.Printf("pointer pointing to %p\n", pointer) // memory address 1
	fmt.Printf("pointer stored at %p\n", &pointer) // memory address 2
	return pointer
}
```

A function usually returns a value when the returned value is small or immutable. On the other hand, it returns a pointer when the returned value is large, to avoid costly copying, or a resource like API client, database connection, or a file, that shouldn't be copied.

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

#### Value receiver method

-   The method operates on a copy of the receiver and is best for reads on small structs.
-   It uses the `func (<RECEIVER_NAME> <RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.
-   We can pass in a receiver pointer and Go automatically dereferences the pointer, making a copy of the receiver, and runs the method.
-   If the struct is small, Go will place its copy on the stack. Otherwise, Go will place its copy on the heap and then new heap allocation per function call will be one large struct copy. Therefore, value receiver is better for small struct reading.

#### Pointer receiver method

-   The method operates on the original receiver via a pointer pointing to the receiver.
and is used for writes or reads on large structs.
-   It uses the `func (<RECEIVER_NAME> *<RECEIVER_TYPE>) <FUNCTION_NAME>(<FUNCTION_PARAMETER>) <RETURN_TYPE>` declaration format.
-   We can pass in a receiver value and Go automatically gets its memory address and runs the method.
-   New heap allocation per function call is zero because the original struct is used. Therefore, pointer receiver is better for struct writing and large struct reading.

### Generic function

A generic function can handle the same parameter of different types using type parameters.

```go
// Declare a function that takes in a T-typed slice `s` and a T-typed variable `x`. The T type can be any type that fulfills the built-in comparable constraint.
// The comparable constraint ensures that we can use a comparison operator like `==` on values of that type.
func getIndex[T comparable](s []T, x T) int
```

### Function error handling

Go addresses function error with an explicit and imperative approach. In general, a function is expected to return a pair of values. The first one is the result value and the other one is the error value. Go expects us to check and handle the error using `if err != nil {}` for every function call.

Here are some tips for function error handling tailored for the [application server directory structure in this post](#application-server-directory-structure).

-   Handler layer (System boundary)
    -   Log error.
    -   Map system error or business error to response with `errors.Is()` and return it.
-   Service layer
    -   Define business errors.
    -   Either wrap system error with context using `fmt.Errorf("failed to do something: %w", err)` and return it, or convert system error to business error with `errors.Is()` and return it.
-   Infrastructure layer
    -   Wrap system error with context and return it.
-   Use custom error struct with logging tools in the observability system for debugging distributed Go services.
    ```go
        type AppError struct {
            Message string
            Error error
        }

        func (e *AppError) Error() string {
            return fmt.Sprintf("%s", e.Message)
        }

        func (e *AppError) Unwrap() error {
            return e.Error
        }

        return &AppError{
            Message: "user not found",
            Error: err
        }
    ```

### Function panic handling

Unlike an expectable error that can be handled via `if err != nil`, a panic means something unrecoverable has occurred and the program cannot continue safely.

When a panic happens in any goroutine of the program, Go performs the following steps.

1.  Stop the program execution immediately.
1.  Unwind the call stack from the root cause of the panic all the way to the main function. As each function is exited, any deferred function is still executed normally.
1.  If the panic reaches the main function without being handled, the program crashes and prints the stack trace following a reverse chronological order (error -> main). The concept behind it is giving the most important detail for debugging first.

We can catch the panic during unwinding using `defer` with `recover()` and implement panic recovering. If `recover()` is called during a panic, it captures the panic value and stops the program from crashing, allowing it to resume normal execution. This is often used in web servers to prevent one bad request from taking down the entire service.

```go
func panicFunction() {
    defer func() {
        if r := recover(); r != nil {
            // Recover the function.
        }
    }()
}
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

#### Empty struct type

Empty struct type, `struct{}`, is a type that takes zero bytes of memory, and is the smallest possible data type in Go. Its type value is `struct{}{}`.

It allows creating a set from a map with empty struct value type, or a channel purely for signaling.

### Interface

An Interface defines a set of method signatures for other types to implement, achieving polymorphism (flexibility). An interface value can hold any concrete type value as long as that concrete type implements those methods.

Under the hood, an interface value is a data structure that contains 2 things.

-   A type pointer for the type metadata like the concrete type and the concrete type method table
-   A data pointer for the concrete type value

When calling an interface value method, Go effectively executes the same-named method of the concrete type value through the below steps.

1.  Look up the concrete type.
1.  Look up the concrete type method table.
1.  Call the concrete type method.

This strips away the below optimizations the Go compiler provides.

-   Devirtualization
    -   Turn the method table lookup (indirect call) into a hardcoded jump to the target method (direct call).
-   Inlining
    -   Replace the method call with the code of the target method.

We can see how the Go compiler applies devirtualization and inlining by building the binary with the [`-gcflags="-m"` flag](#compilation).

When a method is called many times, the indirection may cause considerable latency overhead. Thus, it may be better to use the concrete type instead of the interface in such case.

If the interface value's data pointer is nil, calling the method will result in a nil pointer dereference runtime error. Therefore, it's a good practice to write code to gracefully handle nil receiver method call.

```go
type I interface {
    M()
}

func describe(i I) {
    fmt.Printf("(%v, %T)\n", i, i)
}

type T1 struct {
    S string
}

func (t T1) M() {
    fmt.Println(t.S)
}

type T2 struct {
    S string
}

func (t *T2) M() {
    fmt.Println(t.S)
}

func main() {
    var i I
    describe(i) // (nil, nil)
    i.M()       // nil pointer dereference runtime error

    i = T1{"Here we Go!"}
    describe(i) // ({"Here we Go!"}, main.T1)
    i.M()       // "Here we Go!"

    i = &T2{"Here we Go!"}
    describe(i) // (&{"Here we Go!"}, *main.T2)
    i.M()       // "Here we Go!"
}
```

#### Empty interface type

An interface type that specifies no methods is an empty interface type, `interface{}`, or `any`. An empty interface type value, `interface{}{}`, or `any{}`, can hold any concrete type value and is used to handle the concrete type value that is unknown at compile time but figured out at runtime.

When we use an any type parameter in a function, Go has to box it and place it on the heap, pressuring Garbage Collection (GC).

Heavier GC load causes higher response latency because GC needs longer execution freezes to clean up the heap memory.

If possible, we should change to use typed parameters or [generic type parameters](#generic-function) because the types can be resolved at compile time, leading to zero heap allocation per function call. This is especially useful for high-concurrency logging, eventing, or caching.

#### Interface concrete type assertion

An interface concrete type assertion checks if the interface value holds a value of the specified concrete type. If so, it returns the concrete type value and a true ok value. Otherwise, it returns the zero value of the specified concrete type and a false ok value.

#### Interface type switch

An interface type switch is a switch statement that uses types as cases, rather than values as cases.

```go
func do(i any) {
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

The generic type helps reduce boilerplate code as one generic value can hold any type value and we can consolidate similar logics into one.

```go
// List represents a singly-linked list that holds any type value.
type List[T any] struct {
    next *List[T]
    val  T
}
```

Here are some common use cases.

-   Result container for concurrent goroutine jobs
    -   A result container includes both the value for success and the error for failure. We can pass the result container into the result channel to let the caller know the reason of job failure.
        ```go
        type Result[T any] struct {
            Value T
            Error error
        }
        ```
-   Slice filtering
    ```go
    func Filter[T any](s []T, keep func(T) bool) []T {
        results := make([]T, 0, len(s))
        for _, v := range s {
            if keep(v) {
                results = append(results, v)
            }
        }
        return results
    }
    ```
-   Slice grouping
    -   We may need to create a custom equality function for each custom struct type to make the following `comparable` work.
        ```go
        func GroupBy[T any, K comparable](s []T, key func(T) K) map[K][]T {
            results := make(map[K][]T)
            for _, v := range s {
                k := key(v)
                results[k] = append(results[k], v)
            }
            return results
        }
        ```
-   Slice transforming
    ```go
    func Transform[T, U any](s []T, f func(T) U) []U {
        results := make([]U, len(s))
        for i, v := range s {
            results[i] = f(v)
        }
        return results
    }
    ```
-   Generic cache
    ```go
    type Cache[K comparable, V any] struct {
        mu sync.RWMutex
        pairs map[K]V
    }

    func (c *Cache[K, V]) Set(k K, v V) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.pairs[k] = v
    }

    func (c *Cache[K, V]) Get(k K) (V, bool) {
        c.mu.RLock()
        defer c.mu.RUnlock()
        v, ok := c.pairs[k]
        if !ok {
            return V{}, false
        }
        return v, true
    }

    func main() {
        c := Cache[int, string]{pairs: make(map[int]string)}
        c.Set(1, "one")
        fmt.Println(c.Get(1))
    }
    ```

However, the generic type is not suitable for some use cases.

-   Does not fit HTTP middleware because neither `http.Handler` nor `http.ResponseWriter` is parameterized and is not supported well by standard library or frameworks.
## Concurrency

### Goroutine

A goroutine is a lightweight (2 KB memory) thread managed by the Go runtime, whereas an OS thread (8 MB memory) is managed by the OS.

Given a small number of OS threads (usually the number of logical cores), the Go runtime can schedule thousands of goroutines to run on these few threads.

If a goroutine blocks because of waiting for I/O, the Go runtime scheduler swaps another runnable goroutine onto the thread.

We can start running a function `f(x)` inside a goroutine using `go f(x)`, The evaluation of `f` and `x` happens in the current goroutine and the execution of `f(x)` happens in the new goroutine.

When a goroutine panics, it crashes the entire process.

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

If we have multiple senders, we should use a coordinator goroutine to wait for all senders to finish via `sync.WaitGroup` and then close the channel.

When the passed-in function of `sync.WaitGroup.Go()` panics, it does not call `sync.WaitGroup.Done()` but re-panics to [prevent the main goroutine from proceeding](https://github.com/golang/go/blob/95a0e5adc1e6c27769591de1bfaf520a3265adda/src/sync/waitgroup.go#L244-L250).

Only a single sender or a coordinator goroutine should close the channel because sending to a closed channel causes a panic but receiving from a closed channel doesn't cause a panic.

A receiver can test whether a channel has been closed by assigning a second parameter `ok` to the receive expression. If `ok` is `false` then the channel is closed.

A receiver can use a [for-range loop](#for-range-loop) `for i := range c` to receive elements from the `c` channel repeatedly until it is closed. Note that this blocks the receiver goroutine until the channel is closed. This is one of the occasions where we need to close the channel to let the the receiver goroutine be garbage collected. Other than this, we usually don't need to close a channel.

```go
ch <- y         // Send the value of y to channel ch.
x := <-ch       // Receive an element from channel ch and use it to create x.
close(ch)       // A sender closes the ch channel.
z, ok := <-ch   // A receiver checks if the ch channel is closed via the ok variable.
```

#### Channel buffer

A buffer is a channel's internal queue. By default the buffer capacity is 0, so a send blocks a goroutine until the element it's sending is received by another goroutine. Same for the read, a read blocks a goroutine until another goroutine sends an element to the channel for it to receive.

We can use the second argument of `make` to set the buffer capacity. We can get the buffer capacity via `cap(ch)`, and `len(ch)` for the number of current elements in the buffer.

A send doesn't block a goroutine if the number of current elements in the buffer is less than the buffer capacity. Otherwise, the send blocks the goroutine. A read works in a similar way.

Generally, we don't want the sender to be blocked by a send so we will set the buffer capacity to an exact number or at least an estimate.

### Goroutine worker pool

Although goroutine is cheap, it is not free. Creating one goroutine per job can grow the number of concurrent goroutines indefinitely. Therefore, we often adopt the worker pool pattern to limit the number of goroutines.

If the job is CPU-bound, we can set the number of workers to the number of logical CPUs using the default `GOMAXPROCS`. However, in a containerization environment like Docker or Kubernetes, the Go runtime often sees the host CPU count instead of the container's CPU limit, leading to excessive context switching. Therefore, we should set the worker count to the accurate CPU count using `import _ "go.uber.org/automaxprocs".

If the job is IO-bound, we can use the wait-to-compute ratio `worker count = CPU count x (1 + wait time / compute time)` as a guidance, and scale the worker count from 2x the CPU count to 10x or even more. When the number gets larger, it starts to get limited by other settings like database connection pool size, file descriptor limit, and upstream service rate limit.

```go
// For containerization uncomment the below line.
// import _ "go.uber.org/automaxprocs
type Result struct {
    JobID int
    WorkerID int
    Value int
    Error error
}

func main() {
    in := make(chan int, 100)
    out := make(chan Result, cap(in))

    numWorkers := runtime.NumCPU() // For containerization use runtime.GOMAXPROCS(0) instead.
    var wg sync.WaitGroup
    for workerID := range numWorkers {
        wg.Go(func() {
            work(workerID, in, out)
        })
    }

    for n := range 100 {
        in <- n
    }
    close(in)

    go func() {
        wg.Wait()
        close(out)
    }()

    for o := range out {
        if o.Error != nil {
            fmt.Println(o.Error.Error())
        }
        fmt.Println(o.Value)
    }
    fmt.Println("finished!")
}

func work(workerID int, in <-chan int, out chan<- int) {
    for i := range in {
        if i % 2 == 0 {
            out <- Result{
                JobID: i,
                WorkerID: workerID,
                Value: i * i,
                Error: nil,
            }
        } else {
            out <- Result{
                JobID: i,
                WorkerID: workerID,
                Error: errors.New("remainder is 1"),
            }
        }
    }
}
```

We use a coordinator goroutine to close the `out` channel and thus unblock the main function.

Here we use `sync.WaitGroup` but we can switch to `errgroup` from `golang.org/x/sync/errgroup` if we need the all-or-nothing characteristic.

### Goroutine pipeline

We can create a pipeline with goroutines.

```go
func process1(in <-chan int) <-chan int {
    out := make(chan int, cap(in))
    go func () {
        defer close(out)
        for num := range in {
            out <- num
        }
    }()
    return out
}

func process2(in <-chan int) <-chan int {
    out := make(chan int, cap(in))
    go func () {
        defer close(out)
        for num := range in {
            out <- num
        }
    }()
    return out
}

out1 := process1(in)
out2 := process2(out1)
```

### Goroutine select

Goroutine select is used for cases like signal handling alongside receiving values from a channel. The `select` statement pauses the current goroutine until it can execute one of its communication cases. If multiple are ready, it randomly choose one of them to execute.

We can specify a `default` case for it to send or receive without blocking when other cases are not ready yet.

If the select statement is in the main function, we can label the outer loop and break that loop when the result channel is closed.

```go
func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 4 * time.Second)
	defer cancel()

    results := make(chan int)
    var wg sync.WaitGroup

    for i := range 3 {
        wg.Go(func() {
            multiplyBy10(i, ctx, results)
        })
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    for result := results {
        fmt.Printf("Received result: %d\n", result)
    }
}

func multiplyBy10(i int, ctx context.Context, results chan int) {
    select {
    case <- time.After(2 * time.Second):
        results <- i * 10
    case <- ctx.Done():
        fmt.Printf("Stopped due to context cancellation: %v", ctx.Err())
    default:
        time.Sleep(500 * time.Millisecond)
    }
}
```

### Mutex

We use Mutual-exclusion (Mutex) to ensure the exclusive access of a variable by one goroutine at a time. Go provides the `sync.Mutex` type and its methods, `Lock`, and `Unlock`, to achieve this.

```go
var mu sync.Mutex

go func() {
    mu.Lock()
    defer mu.Unlock()
    process()
}()
```

#### Mutex deadlock

A Mutex deadlock is a situation that each one of the two goroutines is waiting for the resource held by the other one.

```go
var (
    mu1 sync.Mutex
    mu2 sync.Mutex
)

go func() {
    mu1.Lock()
    defer mu1.Unlock()
    process()
    mu2.Lock()
    defer mu2.Unlock()
}

go func() {
    mu2.Lock()
    defer mu2.Unlock()
    process()
    mu1.Lock()
    defer mu1.Unlock()
}
```

One way to prevent the deadlock from happening is to establish a global lock ordering. If every goroutine has to lock `mu1` first and then `mu2`, no deadlock would happen.

#### Mutex blocking

When our code makes an I/O call and writes the result to a shared resource via mutex, we should only lock the mutex during the write, such that other goroutines are not blocked by the I/O call.

### Semaphore

A semaphore is a signaling counter that allows a limited number of goroutines to access a resource. It is useful for database connection rate-limiting.

Mutex is like a semaphore with size one.

```go
type Semaphore chan struct{}

func NewSemaphore(n int) Semaphore {
    return make(Semaphore, n)
}

func (s Semaphore) Acquire() {
    s <- struct{}{}
}

func (s Semaphore) Release() {
    <-s
}

func main() {
    numConnection := 10
    s := NewSemaphore(numConnection)

    var wg sync.WaitGroup
    for i := range numConnection {
        wg.Go(func() {
            s.Acquire()
            defer s.Release()
            worker(i)
        })
    }
    go func() {
        wg.Wait()
        close(out)
    }()
}
```

We can use it for API request rate-limiting too.

```go
type Server struct {
    Mux *httpServeMux
    HTTPServer *http.Server
    Sem Semaphore
}

func (s *Server) rateLimit(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        select {
        case s.Sem <- struct{}{}:
            defer func() { <-s.Sem }()
        default:
            http.Error(w, "too many requests error", http.StatusTooManyRequests)
            return
        }
        next(w, r)
    }
}
```

## Context

Contexts propagate request-scoped data, cancellation and timeout signals across service calls, preventing resource leaks and allowing for graceful shutdowns.

The creation of a context gives us the context and its cancel function. The cancel function closes the context.Done() channel under the hood and we can use the cancel function to cancel the context.

If we use one of the context with cause types like `context.WithCancelCause()`, we use `context.Cause()` for context cancel visibility, otherwise we use `ctx.Err()` given the context `ctx`. However, we till have to be aware of nested timeouts and the complexity brought by cross-service propagation.

-   context.Context
    -   context.Background()
    -   context.TODO()
    -   context.WithCancel()
    -   context.WithCancelCause()
    -   context.WithTimeout()
    -   context.WithTimeoutCause()
    -   context.WithDeadline()
    -   context.WithDeadlineCause()

```go
func work() {
    ctx, cancel := context.WithTimeout(context.Background(), 2 * time.Second) // The timer of ctx starts ticking here.
    defer cancel()

    select {
    case <- time.after(1 * time.Second):
        fmt.Println("Finished work successfully.")
    case <- ctx.Done():
        fmt.Println("Timed out:", ctx.Err())
    }
}
```

In general we want to handle OS signals like interrupt or terminate via `signal.NotifyContext`. Note that the cancel function given by `signal.NotifyContext` can yield back OS signal handling to the OS in addition to its context cancellation functionality. After the OS signal handling is given back to the OS, if we press `Ctrl + C` the second time, then the OS can kill the process by force. That's why we need to call it manually after `<-baseContext.Done()` as receiving an OS signal does cancel the context but the OS signal handling is still held by Go instead of the OS.

```go
func main() {
    baseContext, baseCancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
    defer baseCancel()

	mainContext, mainCancel := context.WithCancelCause(baseContext)
	defer mainCancel(errors.New("main context canceled"))

    backgroundService := &domain.BackgroundService{}

    backgroundService.Start(mainContext, mainCancel)

    server := &http.Server{}

    go func() {
        err := server.ListenAndServe()
        if err != nil && !errors.Is(err, http.ErrServerClose) {
            log.Fatal(err)
        }
    }()

    <-baseContext.Done()
    baseCancel()

    shutdownContext, shutdownCancel := context.WithTimeoutCause(context.Background(), 10 * time.Second, errors.New("shutdown context canceled"))
    defer shutdownCancel()
    server.Shutdown(shutdownContext)
}
```

We use `context.WithValue()` to pass request-scoped data between middleware. However, multiple layers of middleware, each having a `context.WithValue()`, can lead to many heap allocations. It's probably better to store data in a request-to-data map inside the pointer receiver handler struct.

## Dependency management

### Downloading remote modules

In each Go file, we use the `import` keyword to import packages from both local module and remote modules. If two different modules have packages with the same name, we have to use alias for at least one of the package to avoid conflicting import.

```go
import (
    "example.com/module1/x"
    m2x "example.com/module2/x" // Alias example.com/module2/x to m2x.
)
```

-   Use `go get <ORGANIZATION>/<REPOSITORY>/<MODULE>/<PACKAGE>` to add or update packages inside a project and update the `go.mod`.
-   Use `go mod tidy` at the module root directory to add missing packages and remove unneeded ones in `go.mod` and `go.sum`.
-   Use `go install <ORGANIZATION>/<REPOSITORY>/<MODULE>/<PACKAGE>@<VERSION>` to compile and install global CLI tools.
-   Use `go env GOCACHE` to locate the artifact compilation cache and use `go clean -cache` to clear it.
-   Use `go env GOMODCACHE` to locate the downloaded module source code cache and use `go clean -modcache` to clear it.
-   Use `go clean -testcache` to clear the test output cache.

### Removing all downloaded modules

Use `go clean -modcache` to remove all downloaded modules.

## Compilation

We can create an example Go program by making a `here_we_go.go` file.

If we want to produce a binary, `here_we_go.go` must belong to the `main` package and include a `main` function such that the compiler can locate the entrypoint of the binary. During the compilation process, the compiler first converts this Go file into an assembly-like internal representation and then compiles the internal representation into a binary.

If we don't need a binary, then `here_we_go.go` doesn't need to have the `main` package and function. The compilation still runs but produces nothing.

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

We can use the `go build` command to instruct the Go compiler to compile the working directory's Go files into a binary.

```bash
# Generate a binary named after the working directory.
go build

# Generate a binary with the specified binary name.
go build -o <BINARY_NAME>

# Generate a binary with the specified main package path.
go build <MAIN_PACKAGE_PATH>

# Generate a binary with garbage collection decisions printed like devirtualization, inlining, and heap escape.
go build -gcflag="-m"

# Generate a binary with garbage collection decisions and reasoning printed like devirtualization, inlining, and heap escape.
go build -gcflag="-m=2"

# Generate a binary such that it is independent from the host's C libraries and can run in a scratch container without the exec format error and no such file or directory error.
CGO_ENABLE=0 go build -o <BINARY_NAME> <MAIN_PACKAGE_PATH>

# Generate a binary for specified OS and hardware.
GOOS=linux GOARCH=amd64 go build -o <BINARY_NAME> <MAIN_PACKAGE_PATH>
```

### Escape

The compiler promotes a value from the stack to the heap if it cannot prove the value's lifetime is limited to the current function scope. Here are some cases where the compiler makes the value escape from the stack to the heap.

-   The value is returned by the function.
-   The value is stored in a variable that lives outside of the function.
-   The value is passed to a function that accepts `...interface{}` and uses reflection, for example `fmt.Println().

## Execution

And then we can run the produced binary.

```bash
# Run the binary, assuming its name is here-we-go.
./here-we-go
```

Furthermore, we can combine the compile and run into one command `go run`.

```bash
# Generate an ephemeral binary go-buildxxx inside the temporary directory /tmp, running it, and delete the binary after execution.
go run here_we_go.go

# This also works as long as the working directory contains the Go file that includes the main package's main function.
go run .
```

If we want to install the binary so we can run it anywhere on the host, export the Go install path and install the binary.

```bash
# Locate the Go install path.
go list -f '{{.Target}}'

# Export the path.
export PATH=$PATH:<GO_INSTALL_PATH>

# Compile and install the binary to the Go install path.
go install
```

## Logging

-   Use `log/slog` for structured logging.
-   Using `uber-go/zap` or `rs/zerolog` is often too excessive unless for truly large-scale applications.
-   Log non-confidential data only and keep passwords, tokens, and keys redacted. Keep an eye on accidental logging of HTTP requests with `Authorization` headers, struct values with credentials, and error values with secrets.
    ```go
    type APIKey struct {
        Value string
    }

    func (k APIKey) LogValue() slog.Value {
        return slog.StringValue("[REDACTED]")
    }
    ```

## Configuration

-   Use `os.LookupEnv` or `caarlos0/env` for environment variables parsing and `gopkg.in/yaml.v3` for YAML files.
-   Using `spf13/viper` to manage YAML/JSON configuration files, environment variables, flags, is often an overkill unless for truly large-scale applications.

## Validation

-   Use custom validation functions to accommodate business validation logic directly.
-   Using `go-playground/validator` makes it hard to handle business logic and fields depending on each others.

## Dependency injection

-   Use custom constructor functions take in dependencies and create structs.
-   Use the main function to call constructor functions and wire dependencies.
-   Using `google/wire` creates generated-code debugging issue and extra build step.

## Database

-   Use `pgx` for PostgreSQL.
-   If we need boilerplate code reduction, use `sqlc-dev/sqlc` or `database/sql` with extensions like `jmoiron/sqlx`.
-   Using too many abstractions like `go-gorm/gorm` often leads to N+1 problem and abstraction debugging difficulty.

## Networking

-   `encoding/json` package for data serialization/deserialization
-   `net/http` for REST API server and client
-   Default ServeMux is usually sufficient but we can create custom ones too with `http.NewServeMux`,
-   Create our own custom `http.Server` because the default server has no timeout.
-   Create our own custom `http.Client` because `http.DefaultClient` has no timeout and may be modified by imported dependencies. Reuse the same client for connection pool sharing.
-   Close the response body to prevent file descriptor exhaustion.
-   Set CORS check explicitly.
-   Set response security headers.
    ```go
    w.Header().Set("X-Content-Type-Options", "nosniff")
    w.Header().Set("X-Frame-Options", "DENY")
    w.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
    ```
-   Using `gorilla/mux` is obsolete since the release of the updated `net/http` in Go 1.22.
-   `go-chi/chi` is still valuable for complex routing.


### Application server directory structure

The goal of this application server directory structure is decoupling with minimum abstraction. It divides the system into 3 layers, handler, service, and infrastructure.

Here is an application for user registration, login, and logout.

```bash
cmd/
    main/
        main.go
internal/
    server/
        rest.go
    domain/
        user.go
        port.go
    database/
        postgresql.go
go.mod
```

Here are the 3 layers.

-   Handler
    -   Defined in `/internal/server/rest.go`
    -   Decode request, calling service struct methods, and send response.
    -   Take service struct pointers as dependencies.
    -   We want to use the injected service struct methods rather than performing business logic in the handler for better decoupling. This makes creating and switching to a new handler much easier.
-   Service
    -   Defined in `/internal/domain/user.go`
    -   Perform business logic and call infrastructure interface methods.
    -   Take infrastructure interface values as dependencies.
    -   We want to use the injected infrastructure interface values instead of passing the infrastructure interface values to every service struct method as parameters for better decoupling. If we want to add or remove an infrastructure interface value, we don't have to update the parameters of every relevant service struct method.
    -   Infrastructure interfaces are defined in `/internal/domain/port.go`.
    -   Have no dependency on other packages created in the project.
-   Infrastructure (database, API, etc)
    -   Defined in `/internal/database/postgresql.go`
    -   Implement the infrastructure interfaces.

At last, `cmd/main/main.go` creates infrastructure interface values, service structs, the handler, injecting dependencies, and then starts the handler.

### gRPC

gRPC enables a client to call a function on a server as if it were a local function.

#### Protocol buffer

gRPC uses protocol buffers by default to serialize and deserialize structured data. For each service, we use a `.proto` file to define its data structures and methods. Below is an example.

```bash
protocol-buffer/
    proto/
        proto1/
            proto1.proto
    pb/
        proto1/
    go.mod
client/
    client.go
    go.mod
server/
    server.go
    go.mod
go.work
```

{% codeblocktag () %}
proto1.proto
{% end %}
```proto
syntax = "proto3";

option go_package = "github.com/<ORGANIZATION>/<REPOSITORY>/protocol-buffer/pb/proto1";

service Proto1 {
    rpc Method1 (Method1Request) returns (Method1Response);
}

message Method1Request {
    bool foo = 1;
    int32 bar = 2;
    string baz = 3;
}

message Method1Response {
    bool ok = 1;
}
```

The integers `1`, `2`, and `3` are unique IDs used to identify a field in the protocol buffer binary message format. This gives the backward compatibility as renaming a field doesn't break the communication between a new version and the old one.

##### Protocol buffer compilation

After the service definition, we use the protocol buffer compiler, [protoc](https://grpc.io/docs/languages/go/quickstart/#regenerate-grpc-code), to compile the `.proto` files and generate the client and server code for each service.

```bash
protoc --proto_path=protocol-buffer/proto \
       --go_out=protocol-buffer/pb --go_opt=paths=source_relative \
       --go-grpc_out=protocol-buffer/pb --go-grpc_opt=paths=source_relative \
       protocol-buffer/proto/proto1/proto1.proto
```

The directory structure after the code generation is like the following.

```bash
protocol-buffer/
    proto/
        proto1/
            proto1.proto
    pb/
        proto1/
            proto1_grpc.pb.go
            proto1.pb.go
    go.mod
client/
    client.go
    go.mod
server/
    server.go
    go.mod
go.work
```

We can now implement the `client/client.go` and `server/server.go` with the protocol buffer client and server spec defined in the `protocol-buffer/pb/proto1/proto1_grpc.pb.go`.

## Randomness

-   Use `crypto/rand` for session token generation and other security-relevant randomness.
-   Using `math/rand` makes it guessable because it is seeded and deterministic.

## Command Line Interface (CLI)

-   Use `flag` for flag parsing and `switch` statement for subcommands.
-   Using `spf13/cobra` is often too much unless for truly large-scale applications.

## Testing

-   Test function behavior over implementation. Tests should validate what the code promises to do, not how it achieves it. This avoid breaking tests when the underlying implementation changes.
-   `testing` with interface-based mocking
-   `stretchr/testify` for call tracking and more readable test assertions

## Memory management

-   Invalid memory address or nil pointer dereference
    -   An invalid memory address or nil pointer dereference error occurs when a program tries to access a memory region it is not allowed to.

## Containerization

### Build tag

We can use build tags to mark the source file that should only be included during a local build.
```go
//go:build local

// The tag has to be at the top of the file and the second line must be a blank line.
package main

import _ "net/http/pprof"
```

We can include the tag in the build command.

```bash
go build -tags="local" -o <BINARY_NAME> <MAIN_PACKAGE_PATH>
```

### Termination handling

Docker or Kubernetes usually send the `SIGTERM` signal before killing a container with `SIGKILL`, so we should handle the `SIGTERM` signal otherwise in-flight requests will be dropped.

#### Kubernetes termination grace period

In the application pod manifest, set `spec.terminationGracePeriodSeconds` to a number slightly greater than the shutdown timeout duration we configure in the application shutdown handling logic.

### Health check

We can add both the liveness and readiness health check endpoint to the HTTP server.

```go
func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("GET /healthz/live", liveHandler)
    mux.HandleFunc("GET /healthz/ready", readyHandler)

    httpServer := &http.Server{Addr: ":8080", Handler: mux}

    database := &database.PostgreSQL{}

    restServer := &server.RESTServer{HTTPServer: httpServer, Database: database}
}

func (s *RESTServer) liveHandler(w http.ResponseWriter, r *http.Request){
    w.WriteHeader(http.StatusOK)
}

func (s *RESTServer) readyHandler(w http.ResponseWriter, r *http.Request){
    ctx, cancel := context.WithTimeout(r.Context(), 5 * time.Second)
    defer cancel()

    err := s.Database.PingContext(ctx)
    if err != nil {
        http.Error(w, "database is not ready", http.StatusServiceUnavailable)
        return
    }

    w.WriteHeader(http.StatusOK)
}
```

#### Docker health check

Docker only supports single health check so we choose the liveness one. We need to [build a health check binary and configure Docker to use it for health checks in the Dockerfile](@/blog/container.md#health-check).

```go
func main() {
    client := &http.Client{Timeout: 5 * time.Second}
    response, err := client.Get("http://localhost:8080/health/live")
    if err != nil || response.StatusCode != 200 {
        os.Exit(1)
    }
    os.Exit(0)
}
```

#### Kubernetes health check

We configure the liveness and readiness probe endpoint in the [deployment manifest](#kubernetes-deployment) such that Kubernetes can scrape them. See more in the [Kubernetes post](@/blog/kubernetes.md#container-liveness-and-readiness).

### Dockerfile

Here is an example Dockerfile.

```bash
FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLE=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o server ./cmd/server

FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s retries=3 \
    CMD ["./healthcheck"]
ENTRYPOINT ["/server"]
```

-   We put `COPY go.mod go.sum` and `RUN go mod download` before `COPY . .` to prevent a change in a source file from invalidating the module download cache layer.
-   We add `-ldflags="-s -w"` to the build command to further reduce the binary size and increase security.
    -   The `-s` removes the symbol table, which maps memory addresses back to function and variable names. Stripping it makes reverse-engineering the application via tools like `nm` much harder, but also increases the difficulty of troubleshooting as the function names and line numbers in the stack trace logs become unreadable for humans.
    -   The `-w` deletes DWARF debugging information, which enables debuggers like Delve or GDB to set breakpoints, inspect variables, or view stack traces while the program is running.

### Kubernetes Deployment

Here is a deployment manifest example.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: myapp
    labels:
        app: myapp
spec:
    selector:
        matchLabels:
            app: myapp
    replicas: 3
    strategy:
        type: RollingUpdate
        rollingUpdate:
            maxUnavailable: 0
            maxSurge: 1
    template:
        metadata:
            labels:
                app: myapp
        spec:
            terminationGracePeriodSeconds: 30
            containers:
                -   name: myapp
                    image: myrepo/myapp@hash
                    env:
                        -   name: LOG_LEVEL
                            valueFrom:
                                configMapKeyRef:
                                    name: myapp
                                    key: LOG_LEVEL
                        -   name: DB_DSN
                            valueFrom:
                                secretKeyRef:
                                    name: myapp
                                    key: db-dsn
                    ports:
                        -   containerPort: 8080
                    resources:
                        requests:
                            cpu: "100m"
                            memory: "64Mi"
                        limits:
                            cpu: "100m"
                            memory: "64Mi"
                    livenessProbe:
                        httpGet:
                            path: /healthz/live
                            port: 8080
                        initialDelaySeconds: 10
                        periodSeconds: 30
                    readinessProbe:
                        httpGet:
                            path: /healthz/ready
                            port: 8080
                        initialDelaySeconds: 20
                        periodSeconds: 30
```

-   We use `maxUnavailable: 0` to tell Kubernetes to bring up a new pod before taking down an old one during a rollout.
-   We pin the image using its hash because image tag is modifiable.

### Kubernetes ConfigMap and Secret

We use Kubernetes ConfigMap and Secret to store the application settings.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: myapp
data:
    LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
    name: myapp
type: Opaque
stringData:
    db-dsn: "postgres://user:password@host:5432/myapp"
```

Inside our code, we use a config struct and `os.Getenv()` to read from environment variables.

```go
type Config struct {
    LogLevel string
    DBDSN string
}

func LoadConfig() Config {
    return Config{
        LogLevel: os.getEnv("LOG_LEVEL", "info"),
        DBDSN: os.getEnv("DB_DSN"),
    }
}
```

Note that environment variables are visible in `/proc` and can be inherited by child processes. Beside environment variable populating, mounting secret files to the container as volumes, or fetching secrets from a secret manager at startup and keep them in unexported struct fields, are also popular ways to inject configurations into the container.

```go
type Config struct {
    dbPassword string // unexported
    jwtSecret  []byte // unexported
}

func LoadConfig(ctx context.Context, client secrets.Client) (*Config, error) {
    dbPassword, err := client.GetSecret(ctx, "prod/db/password")
    if err != nil {
        return nil, fmt.Errorf("failed to fetch db password: %w", err)
    }
    return &Config{dbPassword: dbPassword}, nil
}
```

### Kubernetes resource request and limit

See more in the [Kubernetes post](@/blog/kubernetes.md#container-resource-request-and-limit).

## Optimization

1.  Profile.
1.  Identify bottleneck from heap escape and goroutine analysis.
1.  Improve and benchmark.

### Profile

Go's built-in profiler `pprof` can start a http server and let we inspect things like heap allocations and how many goroutines are running and which line of code started them. We can set it up with the below steps.

1.  Add `import _ "net/http/pprof"`.
2.  Register the handler function to an existing HTTP ServeMux with `http.HandleFunc("/debug/pprof/", pprof.Index)`. Otherwise, run it in a side server with `go func() {http.ListenAndServe("localhost:6060", nil)}()`.
3.  Visit `http://localhost:6060/debug/pprof/goroutine?debug=1`.

### Benchmark

We can use the built-in benchmark tool to measure performance. First we create the benchmark function.

```go
func BenchmarkBuildURL(b *testing.B) {
    for range b.N {
        buildURL("domain", "/api/users", 8080)
    }
}
```

Then we run the benchmark.

```bash
go test -bench=. -benchmem -count=5 ./...
```

-   `-benchmem` shows allocations per operation.
-   `-count=5` runs each benchmark 5 times to reduce variance.

We can run for heap profile.

```bash
go test -bench=. -memprofile=mem.out
go tool pprof mem.out
```

Or run for CPU profile.

```bash
go test -bench=. -cpuprofile=cpu.out
go tool pprof cpu.out
```

## Production best practice

### Error handling

-   [Server shutdown context and request timeout context](#context)
-   Goroutine panic recover
-   Jittered exponential backoff retry
-   Set server and client timeout.
-   Set request security headers.

### Asynchronous processing

-   [Goroutine pipeline](#goroutine-pipeline)
-   [Buffered channel](#channel-buffer)

### Security

-   Use `crypto/rand` rather than `math/rand` for session token generation and other security-relevant randomness.
-   Prevent logger from logging sensitive data.

### Memory optimization

-   [Goroutine worker pool](#goroutine-worker-pool)
-   [Direct string concatenation](#string-concatenation)
-   [String slice concatenation with strings join](#string-slice-concatenation)
-   [Ephemeral object pool](#byte-slice-generation)
-   [Large struct pointer receiver method](#pointer-receiver-method)
-   [Slice capacity preallocation](#slice-appending)
-   [Generic type function parameter](#generic-function) rather than [any type function parameter](#empty-interface-type)
-   Database connection pool size limit
    -   Without size limit (worse heap allocation)
        -   The pool size can grow indefinitely.
    -   With size limit (good heap allocation)
        -   The pool size has a limit.
-   Cache size limit
    -   Without size limit (worse heap allocation)
        -   The cache size can grow indefinitely.
    -   With size limit (good heap allocation)
        -   The cache size has a limit.
-   GC frequency tuning
    -   With the default 100 GCPercent
        -   GC is triggered when heap grows 100%.
    -   With the 50 GCPercent
        -   GC is triggered when heap grows 50%.

## Adoption challenge

-   Goroutine race condition
-   Heap memory leak as goroutine is blocked waiting on an inactive channel
-   Limited tools and hiring pool

## References

-   [A tour of Go](https://go.dev/tour/welcome/1)
-   [How I reduced memory usage in a Go service by 40%](https://medium.com/@yaninyzwitty/how-i-reduced-memory-usage-in-a-go-service-by-40-0b54c0e16555)
-   [These memory allocation patterns kill Go performance](https://medium.com/codex/these-memory-allocation-patterns-kill-go-performance-333f17df0901)
-   [Go patterns that actually move the performance needle](https://medium.com/codex/go-patterns-that-actually-move-the-performance-needle-b66d24c00f25)
-   [fmt.Sprintf: Looks simple but will burn a hole in your pocket](https://dev.to/yudaph/fmtsprintf-looks-simple-but-will-burn-a-hole-in-your-pocket-h4h)
