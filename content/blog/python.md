+++
title = "Python"
date = 2026-02-05
updated = 2026-02-06
+++

## Hello Python

### Module

A module is a Python file. We use snake_case for Python file names because of compatibility across case-sensitive OS like Linux and case-insensitive OS like Windows and MacOS.

### Package

A package is a collection of modules. We use snake_case for Python package names.

## Event loop

Python builtin package for asynchronous operation, `asyncio`, uses an event loop to enable cooperative multitasking (manual switching with the `await` keyword). The event loop can switch among multiple coroutines to work on many tasks simultaneously. A coroutine must explicitly yield control back to the loop to let other tasks run. If one coroutine gets stuck in an operation without yielding, it freezes/blocks the entire program.

## Execution flow

1.  The Python runtime converts the Python code into bytecode.
1.  The Python runtime compiles the bytecode into machine code and executes it inside the Python virtual machine.

## Memory management

## Dependency management

## References
