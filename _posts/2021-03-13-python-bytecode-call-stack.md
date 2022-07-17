---
title: "Python bytecode and call stack"
excerpt: "This is how Python code executed."
categories:
tags: Python
---

How is Python code executed?

Python source code is compiled into Python virtual machine instructions, which is called the bytecode. The bytecode is then compiled into actual machine code in the virtual machine and gets executed.

Python distributions use a variety of virtual machines. For example, CPython uses a stack-based virtual machine. The call stack is the main structure of a running Python program. It has a frame for each currently active function call, with the bottom of the stack being the entry point of the program.

Every function call pushes a new frame onto the call stack, and every time a function call returns, its frame is popped off.

In each frame, there is an evaluation stack (data stack). This stack is where execution of a Python function occurs, and executing Python code consists mostly of pushing things onto this stack, manipulating them, and popping them off.

There is also a block stack in each frame which helps Python to keep track of certain types of control structures like loops, with and try/except blocks. These entries are pushed onto the block stack when called and popped off whenever exiting.

For example, we have some code that calls a function `my_function(my_variable, 1)`. Python will translate this into 4 bytecode instructions: a `LOAD_NAME` instruction that looks up the function object `my_function` and pushes it onto the top of the current frame's evaluation stack, another `LOAD_NAME` instruction to look up the variable `my_variable` and push it on top of the evaluation stack, a `LOAD_CONST` instruction to push the literal integer value 2 on top of the evaluation stack, and lastly the `CALL_FUNCTION` instruction.

The `CALL_FUNCTION` instruction is first popped off from the evaluation stack and drives Python to pop two positional arguments off the top of the stack; then the function to call will be popped off and executed.

Now Python initiates a new frame on the call stack, populating the local variables for the function call, and executes the bytecode of `my_function` inside the frame. Once that is done, the frame will be popped off from the call stack, and in the original frame the return value of `my_function` will be pushed on top of the evaluation stack.

Understanding bytecode is useful when answering questions like why `{}` is faster than `dict()` for dictionary creation. We just read their Python bytecode and work out the answers (`{}` uses two lines of bytecode while `dict()` uses three lines).

### References

- [An introduction to Python bytecode](https://opensource.com/article/18/4/introduction-python-bytecode)
