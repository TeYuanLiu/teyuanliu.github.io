---
title: "JavaScript 95 - Node properties: type, tag and contents"
date: 2021-08-02
excerpt: "This time we take a more in-depth look at DOM nodes."
categories:
tags: JavaScript DOM
---

### Summary

- `console.log` and `console.dir` both output their arguments to the console for JavaScript objects, but for DOM elements `console.log(elem)` shows the element DOM tree while `console.dir(elem)` shows the element as a DOM object and is good to explore its properties

- Main DOM node properties are:

  - `nodeType` shows whether a node is a text or an element node. It has a numeric value: `1` for elements, `3` for text nodes, and `9` for document object
  - `nodeName/tagName` means tag name (upper-cased unless XML-mode) for elements and for non-element nodes `nodeName` describes what it is while `tagName` is `undefined`
  - `innerHTML` is the HTML content of the element and can be modified. If `innerHTML` inserts a `<script>` tag into the document, it becomes a part of HTML, but doesn't execute. `innerHTML+=` does a full overwrite instead of addition
  - `outerHTML` is the full HTML of the element. A write operation into `elem.outerHTML` does not touch `elem` itself. Instead it gets replaced with the new HTML in the outer context
  - `nodeValue/data` is the content of a non-element node (text, comment) and usually the same. Can be modified
  - `textContent` is the entire text inside the element. Writing into it puts the text inside the element, with all special characters and tags treated exactly as text. Can safely insert user-generated text and protect from unwanted HTML insertions
  - `hidden` does the same as CSS `display:none` when set to `true`

- Most standard HTML attributes have a corresponding DOM property but they are not always the same

### Tasks

- Count descendants

  ```
  let lis = document.querySelectorAll("li");
  for (let li of lis) {
    let title = li.firstChild.data;
    let numDescendants = li.querySelectorAll("li").length;
    console.log(title.trim() + ": " + numDescendants);
  }
  ```

- What's in the nodeType?

  The last DOM node is exactly `<script>` at the time of `<script>` execution so the result is `1`

- Tag in comment

  It shows `BODY`

- Where is the "document" in the hierarchy?

  `document` is an instance of `HTMLDocument` class. `HTMLDocument` inherits from `Document` and `Document` inherits from `Node`.

### References

- [Node properties: type, tag and contents](https://javascript.info/basic-dom-node-properties)
