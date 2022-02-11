---
title: "How does JavaScript run inside a browser?"
date: 2021-07-17
excerpt: "Or, how do call stack, webapis, callback queue, and event loop work together within a browser (JavaScript runtime environment)?"
categories:
tags: JavaScript Browser
---

We often heard that JavaScript running inside browser is **single-threaded and non-blocking**, but what does it mean anyways?

Well, to answer this, we have to first look at how JavaScript is executed. Nowadays, JavaScript code is executed by a special program called the JavaScript engine, sometimes known as the JavaScript virtual machine.

### JavaScript engine

Given a JavaScript file, the JavaScript engine processes and executes it line by line. For each line, the engine reads (parses) the code, converting (compiling) it into machine code, and then runs the machine code.

Inside the JavaScript engine, there are a memory heap and a call stack. The memory heap is used to store variables and functions and all the objects needed, while the call stack stores frames and is the main structure of running JavaScript program.

At the beginning of the program execution, the call stack is empty. As the program being executed, whenever a function call is invoked, a new stack frame is created and pushed onto the stack. Every time a function call returns, its frame gets popped off from the stack. The call stack works in a last-in first-out fashion, therefore, the frame of the program entry point, usually the "main" function, stays at the bottom of the stack until the entire program execution is finished. As you can see, execution of JavaScript code consists mostly of pushing things onto the stack, manipulating them, and popping them off. The engine always works on the frame at the top so the call stack basically establishes the priority of code execution. Because we only have one call stack, or one sequence of function execution, inside the engine, this process is called **single-threaded**.

### Browser

Some functions are lightweight and get executed fast, but there are also functions that rely on services outside of the engine and can take a very long time to finish such as DOM, AJAX requests, and timeouts. Remember that the engine processes one thing at a time, so these functions can make the engine idling and waiting for response from an external service, thus forming a **blocking** situation.

Here is when the browser comes to the rescue. The browser places these functions from the call stack to its webapis pool such that the engine is released from spinning and can do other work. When a function waiting inside the webapis gets its response back from an external service, the browser sends it to a queue known as the task queue. A controller called event loop constantly looks at the call stack and whenever the call stack is empty, meaning the engine is idling, it will push the first task in the task queue onto the call stack and the engine can start processing it. Therefore, functions rely on external services go from the call stack, to the webapis, to the task queue, and finally back to the call stack. This mechanism helps prevent the engine from idling just to wait for a network request or other response, and this is how the **non-blocking** feature being achieved.

### Wrapping up

Nice! We have learned how the JavaScript engine collaborates with the browser to achieve the single-threaded non-blocking attribute and can see a more complete picture about JavaScript execution now.

### References

- [What the heck is the event loop anyway](https://youtu.be/8aGhZQkoFbQ)
