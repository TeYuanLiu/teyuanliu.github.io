---
title: "JavaScript Info 1.2.5 - Data types"
excerpt: "There are eight basic data types in JavaScript."
categories:
tags: JavaScript
index: 9
---

### Summary

- Dynamic typing, meaning that there exist data types, but variables are not bound to any of them. A union is a special data type available in programming language C that allows storing different data types in the same memory location and dynamic typing is often implemented using tagged union.

- The `Number` type represents both integer and floating point numbers. Besides regular numbers, there are special numeric values like `Infinity`, `-Infinity`, and `NaN`.

- The `BigInt` type was recently added to the language to represent integers of arbitrary length. It is useful when we are doing stuff like cryptography or microsecond-precision timestamps. A `BigInt` can be created by appending `n` to the end of an integer.

- A `String` type has to be surrounded by quotes. Double and single quotes are simple quotes while backticks are extended functionality quotes that allow variable and expression embedding using `${...}`.

- The `Boolean` type has only two values, `true` and `false`.

- The `null` type is a special one represents unknown value. It is not a reference to a non-existing object or a null pointer.

- The `undefined` type means the variable is declared but not assigned. Technically it is possible to explicitly assign `undefined` to a variable but it is note recommended. Normally, one uses `null` to assign an empty or unknown value to a variable, while `undefined` is reserved as a default initial value for unassigned things.

- The `Object` type is used to store collections of data and more complex entities compared with every other type which is primitive and stores only one single thing.

- The `Symbol` type is used to create unique identifiers for objects.

- The `typeof` operator returns the type of the operand.

- The result of `typeof Math` is `object` as `Math` is a built-in object that provides mathematical operations.

- The result of `typeof null` is `object`. That's an officially recognized error, coming from very early days of JavaScript and kept for compatibility. `null is a special value with a separate type of its own.

- The result of `typeof alert` is `function`. `function` belongs to the object type, so what `typeof` shows is incorrect, but can be convenient in practice.

- `typeof(x)` is the same as `typeof x`. `typeof` is an operator, not a function. The parentheses here aren't a part of `typeof` but a kind of mathematical grouping for expression.

### Tasks

- String quotes

  ```
  let name = "Ilya"
  alert(`hello ${1}`)
  // hello 1
  alert(`hello ${"name"}`)
  // hello name
  alert(`hello ${name}`)
  // hello Ilya
  ```

### References

- [Data types](https://javascript.info/types)
