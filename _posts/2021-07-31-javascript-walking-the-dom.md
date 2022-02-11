---
title: "JavaScript 93 - Walking the DOM"
date: 2021-07-31
excerpt: "The DOM allows us to do anything with elements and their contents, but first we need to reach the corresponding DOM object. All operations on the DOM start with the document object. That's the main entry point to DOM. From it we can access any node."
categories:
tags: JavaScript DOM
---

### Summary

- The `document` is the root and entry point of the DOM tree.

- In the DOM, the `null` value means no such node.

- Children of DOM nodes are collections and are read-only and require methods to change them.

- Use `for..of` instead of `for..in` to iterate through children of DOM nodes as `for..in` loop iterates over all enumerable properties including some special properties we usually do not want to get.

- `document` is not an element node.

- Given a DOM node, we can go to its immediate neighbors using navigation properties.

  - For all nodes: `parentNode`, `childNodes`, `firstChild`, `lastChild`, `previousSibling`, `nextSibling`.
  - For element nodes only: `parentElement`, `children`, `firstElementChild`, `lastElementChild`, `previousElementSibling`, `nextElementSibling`.

### Tasks

- DOM children

  ```
  // the <div> DOM node
  let elem = document.body.firstElementChild;

  // the <ul> DOM node
  elem = document.body.lastElementChild;

  // the second <li>
  elem = document.body.lastElementChild.lastElementChild
  ```

- The sibling question

  - `elem.lastChild.nextSibling` is indeed always `null`
  - `elem.children[0].previousSibling` can be a non-element node so is not always `null`

- Select all diagonal cells

  ```
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].cells[i].style.backgroundColor = 'red';
  }
  ```

### References

- [Walking the DOM](https://javascript.info/dom-navigation)
