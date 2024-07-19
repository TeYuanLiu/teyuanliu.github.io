---
title: "JavaScript Info 1.2.5 - Data types"
excerpt: "There are eight basic data types in JavaScript."
categories:
tags: JavaScript
index: 9
---

### Summary

- Dynamic typing, meaning that there exist data types, but variables are not bound to any of them. A union is a special data type available in programming language C that allows storing different data types in the same memory location and dynamic typing is often implemented using tagged union.

- The `number` type represents both integer and floating point numbers. Besides regular numbers, there are special numeric values like `Infinity`, `-Infinity`, and `NaN`.

- The `bigInt` type was recently added to the language to represent integers of arbitrary length.

- A `string` type has to be surrounded by quotes. Double and single quotes are simple quotes while backticks are extended functionality quotes that allow variable and expression embedding using `${...}`.

- The `boolean` type has only two values, `true` and `false`.

- The `null` type is a special one represents unknown value.

- The `undefined` type means the variable is declared but not assigned.

- The `object` type is used to store collections of data and more complex entities compared with every other type which is primitive and stores only one single thing.

- The `symbol` type is used to create unique identifiers for objects.

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
