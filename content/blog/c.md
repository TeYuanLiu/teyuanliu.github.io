+++
title = "C"
date = 2025-05-04
updated = 2026-06-28
+++

## Execution flow

1.  The GNU Compiler Collection (GCC) converts our C code into an assembly specific to our CPU architecture like x86_64, amd64, arm64.
1.  The assembler compiles the assembly into a group of binaries, also called object files.
1.  The linker combines the object files and libraries into the final binary.
1.  The machine executes the final binary.

## Memory management

### Memory layout

Below is the memory layout listed from top to bottom in the memory space.

-   Kernel space
    -   Accessing this region causes [segmentation fault](#segmentation-fault).
-   Stack
    -   Include function calls and local variables.
    -   Deep recursion causes [stack overflow](#stack-overflow).
    -   Grow downward.
-   Unused memory
-   Heap
    -   Malloc/new dynamic allocations
    -   Invalid free/dereferencing causes segmentation fault.
    -   Grow upward.
-   BSS
    -   Uninitialized global variables
-   Data
    -   Initialized global variables
-   Text
    -   Compiled code
-   NULL (memory address 0x0)
    - Dereferencing this causes segmentation fault.

### Common memory bugs

#### Segmentation fault

A segmentation fault occurs when a program tries to access a memory region it is not allowed to. Some examples are listed below.

-   Read/write outside of array bounds
-   Use/free a null pointer
-   Use-after-free
-   Double free

#### Stack overflow

A stack overflow happens when a program uses too much stack memory. Some examples are listed below.

-   Deep recursion
-   Large local variable allocation

## Dependency management

## References
