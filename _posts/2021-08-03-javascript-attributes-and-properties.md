---
title: "JavaScript 96 - Attributes and properties"
excerpt: "When the browser loads the page, it reads the HTML and generates DOM objects from it. For element nodes, most standard HTML attributes automatically become properties of DOM objects. But the attribute-property mapping is not one to one and we are gonna discuss it here."
categories:
tags: JavaScript DOM
---

### Summary

- DOM properties and methods behave just like those of regular JavaScript objects:

  - They can have any value
  - Their names are case-sensitive

- HTML attributes have the following features:

  - Their values are always strings
  - Their name is case-insensitive

- Methods to work with attributes are:

  - `elem.hasAttribute(name)` - to check for existence
  - `elem.getAttribute(name)` - to get the value
  - `elem.setAttribute(name, value)` - to set the value
  - `elem.removeAttribute(name)` - to remove the attribute
  - `elem.attributes` is a collection of all attributes

- For most situations using DOM properties is preferable. We should refer to attributes only when DOM properties do not suit us, for example:

  - We need a non-standard attribute. But if it starts with `data-`, then we should use dataset
  - We want to read the value as written in HTML. The value of the DOM property may be different, for instance the `href` property is always a full URL, and we may want to get the original value

### Tasks

- Get the attribute

  ```
  let node = document.querySelector("[data-widget-name]");
  alert(node.dataset.widgetName);
  ```

- Make external links orange

  ```
  for (let link of document.querySelectorAll("a")) {
    let href = link.getAttribute("href");
    if (!href) continue;
    if (!href.includes("://")) continue;
    if (href.startsWith("http://internal.com")) continue;
    link.style.color = "orange";
  }
  ```

### References

- [Attributes and properties](https://javascript.info/dom-attributes-and-properties)
