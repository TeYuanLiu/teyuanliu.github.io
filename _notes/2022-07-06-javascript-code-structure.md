---
title: "JavaScript Info 1.2.2 - Code structure"
excerpt: "The building blocks of code."
categories:
tags: JavaScript
index: 6
---

### Summary

- Statements are syntax constructs and commands that perform actions.

- In most cases, a newline implies a semicolon. However, there are occasions that Javascript does NOT insert semicolons. For example in the following code JavaScript does not insert semicolons there because it is obvious that if the line ends with a plus sign, then it is an incomplete expression, so a semicolon there would be incorrect.

  ```
  alert(3 +
  1
  + 2);
  ```

- But there are situations where JavaScript fails to assume a semicolon where it is really needed. For example, JavaScript does not assume a semicolon before square brackets, so the following two code snippets are equivalent. Only the first `Hello` shows, and then it shows an error.

  ```
  alert("Hello")
  [1, 2].forEach(alert);
  ```

  ```
  alert("Hello")[1, 2].forEach(alert);
  ```

- As time goes on, programs become more and more complex. It becomes necessary to add comments which describe what the code does and why.

- One-line comments start with two forward slash characters `//`.

- Multiline comments start with a forward slash and an asterisk `/*` and end with an asterisk and a forward slash `*/`.

- Use `Ctrl+/` to comment out one line of code and `Ctrl+Shift+/` for multiline comments. For Mac, try `Cmd` instead of `Ctrl` and `Option` instead of `Shift`.

- Comments increase the overall code footprint, but that's not a problem at all. There are many tools which minify code and they remove comments automatically. Therefore, comments do not have negative effects on production at all.

### References

- [Code structure](https://javascript.info/structure)
