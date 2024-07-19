---
title: "JavaScript Info 1.2.4 - Variables"
excerpt: "A variable has its memory address, value, and name(s)."
categories:
tags: JavaScript
index: 8
---

### Summary

- `let` is a modern variable declaration.

- Use `let` over old-school `var` to declare variables because `var` has no block scope and can only be either function-scoped or global-scoped.

- The variable name must contain only letters, digits, or the symbols `$` and `_`, and the first character must not be a digit.

- In JavaScript, camelCase is commonly used for multiple words name.

- Use `const` instead of `let` to declare a constant variable that cannot be changed after assignment. Constants known prior to execution are usually named using capital letters and underscores, and constants that are calculated in run-time are named using camelCase.

### Tasks

- Working with variables

  ```
  let admin, name
  name = "John"
  admin = name
  alert(admin)
  ```

- Giving the right name

  ```
  let ourPlanetName = "Earth"
  let currentUserName
  ```

- Uppercase const?

  ```
  const BIRTHDAY = '18.04.1982'
  const age = someCode(BIRTHDAY)
  ```

### References

- [Variables](https://javascript.info/variables)
