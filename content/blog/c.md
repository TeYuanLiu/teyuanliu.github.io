+++
title = "C"
date = 2025-05-04
updated = 2025-05-04
+++

## Memory layout

Below is the memory layout listed from top to bottom in the memory space.

-   Kernel space
    -   Access this region can cause segmentation fault.
-   Stack
    -   Include function calls, local variables.
    -   Deep recursion and large local variable variable allocation can cause stack overflow.
    -   Grow downward.
-   Unused memory
-   Heap
    -   Malloc/new dynamic allocations
    -   Invalid free/deref can cause segmentation fault.
    -   Grow upward
-   BSS
    -   Uninitialized global variables
-   Data
    -   Initialized global variables
-   Text
    -   Compiled code
-   NULL (memory address 0x0)
    - Deref can cause segmentation fault here.

### Common memory bugs

- Segmentation fault
    - A segmentation fault occurs when a program tries to access a memory region it is not allowed to. Some examples are listed below.
        -   Read/write outside of array bounds
        -   Dereferencing a null or dangling pointer
- Stack overflow
    - A stack overflow happens when a program uses too much stack memory. Some examples are listed below.
        -   Deep recursion
        -   Large local variable allocation

## See also
