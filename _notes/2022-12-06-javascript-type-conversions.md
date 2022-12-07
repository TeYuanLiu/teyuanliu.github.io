---
title: "JavaScript 11 - Type Conversions"
excerpt: "The three most widely used type conversions are to string, to number, and to boolean."
categories:
tags: JavaScript
index: 11
---

### Summary

- String conversion occurs can be performed with `String(value)`. The conversion to string is obvious for primitive values.

- Numeric conversion can be performed with `Number(value)` and follows the rules:

  - `undefined` becomes `NaN`

  - `null` becomes `0`

  - `true / false` becomes `1 / 0`

  - `string` is read as is by stripping white spaces from both sides and an empty string gives `0` and an error gives `NaN`

- Boolean conversion can be performed with `Boolean(value)` and follows the rules:

  - `0, null, undefined, NaN, ""` becomes `false`

  - any other value becomes `true`

### References

- [Type conversions](https://javascript.info/type-conversions)
