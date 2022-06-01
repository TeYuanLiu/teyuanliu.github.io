---
title: "JavaScript 91 - Browser environment, specs"
excerpt: "The JavaScript language was initially created for web browsers. Since then it has evolved and become a language with many uses and platforms. Each of them provides platform-specific functionality but browsers remain the most popular platform to execute JavaScript."
categories:
tags: JavaScript Browser
---

### Summary

- `window`

  - Root object that has children DOM, BOM, and JavaScript
  - Global object for JavaScript code

- DOM (Document Object Model)

  - Represent all page content as objects
  - The `document` object is the main entry point to the page which we can use to modify the page

- BOM (Browser Object Model)

  - Represent additional objects provided by the browser for working with everything except the document such as the navigator object and the location object
  - Functions `alert/confirm/prompt` are also a part of BOM: they are directly not related to the document, but represent pure browser methods of communicating with the user

- DOM specification

  - Describes the document structure, manipulations and events

- CSSOM specification

  - Describes stylesheets and style rules, manipulations with them and their binding to documents

- HTML specification

  - Describe the HTML language (e.g. tags) and also the BOM (browser object model) - various browser functions: `setTimeout`, `alert`, `location` and so on. It takes the DOM specification and extends it with many additional properties and methods.

### References

- [Browser environment, specs](https://javascript.info/browser-environment)
