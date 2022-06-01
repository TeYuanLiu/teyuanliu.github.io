---
title: "JavaScript 98 - Styles and classes"
excerpt: "JavaScript can modify both classes and style properties but we should always prefer CSS classes to style."
categories:
tags: JavaScript DOM Styles
---

### Summary

- There are generally two ways to style an element:

  - Create a class in CSS and add it using `<div class="...">`
  - Write properties directly using `<div style="...">`.
  - We should always prefer CSS classes to `style`. The latter should only be used if classes cannot handle it.

- To manage classes, there are two DOM properties:

  - `className`: the string value, good to manage the whole set of classes.
  - `classList`: the object with methods `add/remove/toggle/contains`, good for individual classes.

- The `style` property is an object with camelCased styles. Reading and writing to it has the same meaning as modifying individual properties in the `style` attribute.

  - For multi-word property a dash implies upper case, such as `elem.style.backgroundColor`.
  - The `style` property operates only on the value of the `style` attribute, without any CSS cascade, which means anything from CSS classes is hidden.
  - The `style.cssText` property corresponds to the whole `style` attribute, the full string of styles.

- There are two concepts in CSS:

  - A computed style value is the value after all CSS rules and CSS inheritance is applied, as the result of the CSS cascade. If can be relative values like `1em` or `120%`.
  - A resolved style value is the one finally applied to the element. The browser takes the computed value and makes all units fixed and absolute, usually in pixels.
  - To read the resolved styles we use `getComputedStyle(elem, [pseudo])` to get the read-only style-like object.

### Tasks

- Create a notification

  ```
  function showNotification({ top = 0, right = 0, className, html }) {
    let notification = document.createElement("div");
    notification.className = "notification";
    if (className) {
      notification.classList.add(className);
    }

    notification.style.top = top + "px";
    notification.style.right = right + "px";

    notification.innerHTML = html;
    document.body.append(notification);

    setTimeout(() => notification.remove(), 1500);
  }
  ```

### References

- [Styles and classes](https://javascript.info/styles-and-classes)
