---
title: "JavaScript 10 - Interaction: alert, prompt, confirm"
excerpt: "The browser has a couple of functions to interact with the user."
categories:
tags: JavaScript
index: 10
---

### Summary

- The `alert` function shows a modal window with a text message and waits for the user to press "OK". The word "modal" means that the visitor cannot interact with the rest of the page until they have dealt with the window.

- The `prompt` function shows a modal window with a text message asking the user to input text. It returns the text or, if Cancel button or `Esc` is clicked, `null` (in IE instead of `null` the returned value is `undefined`).

- The `confirm` function shows a modal window with a message and waits for the user to press OK or Cancel. It returns `true` for OK and `false` for Cancel/`Esc`.

### Tasks

- A simple page

  ```
  name = prompt("name: ", "")
  alert(name)
  ```

### References

- [Interaction: alert, prompt, confirm](https://javascript.info/alert-prompt-confirm)
