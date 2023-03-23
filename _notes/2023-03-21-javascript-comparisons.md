---
title: "JavaScript 13 - Comparisons"
excerpt: "There are many different types of comparisons."
categories:
tags: JavaScript
index: 13
---

### Summary

- All comparison operators, including greater/less than, greater/less than or equals, equals, and not equals, return a boolean value, either `true` or `false`.

- JavaScript uses lexicographical order to do string comparison.

- When comparing values of different types, JavaScript converts the values to numbers.

- A regular equality check `==` cannot differentiate `0` from `false`. This happens because operands of different types are converted to numbers by the equality operator `==`. An empty string, just like `false`, becomes a zero. Thus, we use a **strict equality operator** `===` to check the equality without type conversion. There is also a **strict non-equality operator** `!==` analogous to `!=`.

- For a non-strict check `==`, `null` and `undefined` equals each other, but not any other value. For maths and other comparisons like `<`, `>`, `<=`, and `>=`, `null` becomes `0` while `undefined` becomes `NaN`. To sum up, treat any comparison with `undefined/null` except the strict equality `===` with exceptional care. Don't use comparisons `<`, `>`, `<=`, and `>=` with a variable which may be `null/undefined`.

### Tasks

- Comparisons

  ```
  5 > 4 // true
  "apple" > "pineapple" // false
  "2" > "12" // true
  undefined == null // true
  undefined === null //false
  null == "\n0\n" //false
  null === +"\n0\n" //false
  ```

### References

- [Comparisons](https://javascript.info/comparison)
