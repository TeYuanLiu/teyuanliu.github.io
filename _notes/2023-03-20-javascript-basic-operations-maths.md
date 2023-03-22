---
title: "JavaScript 12 - Type Conversions"
excerpt: "There are many operators ranging from simple arithmetic to JavaScript-specifics."
categories:
tags: JavaScript
index: 12
---

### Summary

- An `operand` is what operators are applied to.

- An operator is unary if it has a single operand for example the unary negation `-`.

- An operator is binary if it has two operands.

- Math operations like addition `+`, subtraction `-`, multiplication `*`, division `/`, remainder `%`, and exponentiation `**` are supported.

- For the plus operator `+`, if any of the operands is a string, then the other one is converted to a string to do string concatenation. The binary plus is the only operator that supports strings in such a way. Other arithmetic operators work only with numbers and always convert their operands to numbers.

- The unary plus `+` converts its operand into a number if it isn't. It does the same thing as `Number(...)`, but is shorter.

- The operator with larger precedence number executes first. The unary plus/negation have precedence of `14`, followed by exponentiation `13`, and then multiplication/division `12`, and then addition/subtraction `11`. By the way, assignment has precedence of `2`.

- Assignment returns a value. That is, the call `x = value` writes the `value` into `x` and then returns it. This enables chained assignments that evaluate from right to left and all the variables share a single value.

- Modify-in-place operators like `+=` and `*=` have the same precedence as a normal assignment.

- Increment/decrement operators have two forms, prefix form and postfix form. The prefix form returns the new value while the postfix form returns the old value (prior to increment/decrement).

- Bitwise operators treat arguments as 32-bit integer numbers and work on the level of their binary representation. These operators include AND `&`, OR `|`, XOR `^`, NOT `~`, LEFT SHIFT `<<`, RIGHT SHIFT `>>`, and ZERO-FILL RIGHT SHIFT `>>>`.

- The comma operator `,` is one of the rarest and most unusual operators. It allows us to evaluate several expressions but only return the last result. Note that comma operator has very low precedence, lower than `=`, so parentheses are important when using them.

### Tasks

- The postfix and prefix forms

  ```
  let a = 1, b = 1;

  let c = ++a; // a = 2, b = 1, c = 2, d = undefined
  let d = b++; // a = 2, b = 2, c = 2, d = 1
  ```

- Assignment result

  ```
  let a = 2;

  let x = 1 + (a *= 2); // a = 4, x = 5
  ```

- Type conversions

  ```
  "" + 1 + 0 // "10"
  "" - 1 + 0 // -1
  true + false // 1
  6 / "3" // 2
  "2" * "3" // 6
  4 + 5 + "px" // "9px"
  "$" + 4 + 5 // "$45"
  "4" - 2 // 2
  "4px" - 2 // NaN
  "  -9  " + 5 // "  -9  5"
  "  -9  " - 5 // -14
  null + 1 // 1
  undefined + 1 // NaN
  " \t \n" - 2 // -2
  ```

- Fix the addition

  ```
  let a = prompt("First number?", 1);
  let b = prompt("Second number?", 2);

  alert(a + b); // This line should be alert(+a + +b) to get the result of 3 instead of "12"
  ```

### References

- [Basic operators, maths](https://javascript.info/operators)
