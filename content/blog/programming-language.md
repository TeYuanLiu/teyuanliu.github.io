+++
title = "Programming Language"
date = 2025-04-20
updated = 2025-05-04
+++

We use programming languages to talk to computers, but how does it work? Here we list out some common syntax, characteristics of different programming languages and how their code get executed on a computer.
<!-- more -->

## Type

Static type means the type of every variable is known at compile-time, while dynamic type indicates that some variables have unknown type at compile-time, which are figured out during run-time.

## Syntax

### For loop vs while loop

-   Use `for` when we know how many times we are looping.
-   Use `while` when we don't know beforehand how many times we will loop.

## Language specifics

## Code execution flow

Our human readable source code has to go through a sequence of operations to become electrical signals on silicon chips.
-   Source code to binary
    -   Assembly
        -   The assembler compiles assembly like `ADD R0, R1` into binary like `0001 0000 0001`.
    -   C
        -   The GNU Compiler Collection (GCC) converts C code into assembly specific to our CPU architecture like x86_64, amd64, arm64.
        -   The assembler compiles assembly into binary, also called object file.
        -   The linker combines object files and libraries into the final binary.
-   Binary to electrical signal
    -   CPU executes binary by running electrical signals inside logic gates.
        -   Fetch
            -   Fetch an instruction from memory.
        -   Decode
            -   Decode the operation and operands.
        -   Execute
            -   Execute ALU operation or control flow adjustment.
        -   Memory
            -   Access memory to perform load (memory to register) or store (register to memory) instruction.
        -   Writeback
            -   Writeback the instruction result to the register.

## See also
