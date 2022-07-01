---
title: "JavaScript 94 - Searching: getElement*, querySelector*"
excerpt: "DOM navigation properties are great when elements are close to each other. What if they are not? How to get an arbitrary element of the page? Here we summarize some additional searching methods for that."
categories:
tags: JavaScript DOM
index: 94
---

### Summary

- There are 6 main methods to search for nodes in DOM:

  - `querySelector` searches by CSS-selector, and can call on an element and is not live
  - `querySelectorAll` searches by CSS-selector, and can call on an element and is not live
  - `getElementById` searches by `id`, and can only call on `document` and is not live
  - `getElementsByName` searches by `name`, and can only call on `document` and is live
  - `getElementsByTagName` searches by tag or `*`, and can call on an element, and is live
  - `getElementsByClassName` searches by class, and can call on an element, and is live

- By far the most used are `querySelector` and `querySelectorAll`, but `getElement(s)By*` can be helpful as well

- Using `document.getElementById` is preferred over `id` directly to avoid confusion about where the variable comes from

- There is `elem.matches(css)` to check if `elem` matches the given CSS selector

- There is `elem.closest(css)` to look for the nearest ancestor that matches the given CSS-selector. The `elem` itself is also checked

- There is `elemA.contains(elemB)` returns true if `elemB` is inside `elemA` or when `elemA==elemB`

### Tasks

- Search for elements

  ```
  // the table with id="age-table"
  let table = document.getElementById("age-table")

  // all label elements inside that table
  let labels = table.getElementsByTagName("label")

  // the first td in that table
  let firstTd = table.querySelector("td")

  // the form with name="search"
  let form = document.getElementsByName("search")[0]

  // the first input in that form
  let firstInput = form.querySelector("input")

  // the last input in that form
  let inputs = form.querySelectorAll("input")
  let LastInput = inputs[inputs.length - 1]
  ```

### References

- [Searching: getElement\*, querySelector\*](https://javascript.info/searching-elements-dom)
