+++
title = "Programming Language"
date = 2025-04-20
updated = 2025-12-17
+++

We use programming languages to talk to computers, but how does it work? Here we discuss a few concepts about programming languages including types, syntax, and execution flow.
<!-- more -->

## Type

Static type means the type of every variable is known at compile-time, while dynamic type indicates that some variables have unknown type at compile-time, and are figured out later during run-time.

## Syntax

### For loop vs while loop

-   Use the `for` loop when we know how many times we are looping.
-   Use the `while` loop when we don't know beforehand how many times we will loop.

## Execution flow

Human readable source code has to go through a sequence of operations to become electronic signals on a silicon chip.
-   Source code to binary
    -   Assembly
        -   The assembler compiles the assembly code like `ADD R0, R1` into the binary like `0001 0000 0001`.
    -   C
        -   The GNU Compiler Collection (GCC) converts C code into the assembly specific to our CPU architecture like x86_64, amd64, or arm64.
        -   The assembler compiles the assembly into a group of binaries, also called object files.
        -   The linker combines the object files and libraries into the final binary.
    -   English
        -   The English compiler converts a set of English sentences into a binary.
-   Binary to electrical signal
    -   The CPU executes the binary by running electronic signals inside the logic gates.
        -   Fetch
            -   Fetch an instruction from memory.
        -   Decode
            -   Decode the instruction's operation and operands.
        -   Execute
            -   Execute the Arithmetic Logic Unit (ALU) operation or control flow adjustment.
        -   Memory
            -   Access memory to perform load (memory to register) or store (register to memory) operation.
        -   Writeback
            -   Save the result of the instruction execution to the register.

## See also
