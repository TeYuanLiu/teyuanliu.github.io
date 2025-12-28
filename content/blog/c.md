+++
title = "C"
date = 2025-05-04
updated = 2025-12-27
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
    -   Accessing this region can cause [segmentation fault](#common-memory-bugs).
-   Stack
    -   Include function calls, local variables.
    -   Deep recursion and large local variable allocation can cause stack overflow.
    -   Grow downward.
-   Unused memory
-   Heap
    -   Malloc/new dynamic allocations
    -   Invalid free/dereferencing can cause segmentation fault.
    -   Grow upward.
-   BSS
    -   Uninitialized global variables
-   Data
    -   Initialized global variables
-   Text
    -   Compiled code
-   NULL (memory address 0x0)
    - Dereferencing this can cause segmentation fault here.

### Common memory bugs

-   Segmentation fault
    -   A segmentation fault occurs when a program tries to access a memory region it is not allowed to. Some examples are listed below.
        -   Read/write outside of array bounds
        -   Use/free a null pointer
        -   Use-after-free
        -   Double free
-   Stack overflow
    -   A stack overflow happens when a program uses too much stack memory. Some examples are listed below.
        -   Deep recursion
        -   Large local variable allocation

## Dependency management

## References
