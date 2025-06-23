+++
title = "Rust"
date = 2025-05-01
updated = 2025-05-01
+++

[Rust](https://www.rust-lang.org/) is a system language that uses a ownership and borrowing system enforced at compile time to ensure memory safety without needing a garbage collector.
<!-- more -->

## Setup

Rust has its installation management tool `rustup`, compiler `rustc` and package manager `cargo`.

## Compiler

Rust's compiler checks for many things such as array indexing, and prevents many types of memory bugs common in C/C++:
-   Dangling pointers
-   Use-after-free
-   Double free

Note that Rust has an `unsafe` keyword, which can bypass compiler checks and allow potential memory corruption if misused.
-   Raw pointer dereferencing

### Compiling flow

1.  The Rust compiler converts Rust code into Low-Level Virtual Machine (LLVM) Intermediate Representation (IR), which is a platform-independent representation.
1.  The LLVM optimizes and translates the IR to assembly specific to our CPU architecture.
1.  The assembler compiles assembly into binary.

## See also
