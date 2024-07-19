---
title: "JavaScript Info 1.1.1 - An introduction to JavaScript"
excerpt: "What can we achieve using JavaScript?"
categories:
tags: JavaScript
index: 1
---

### Summary

- JavaScript was initially created as a browser-only language to integrate with HTML/CSS, but it is now used in server and many other environments as well.

  - In-browser JavaScript can do everything related to webpage manipulation, interaction with the user, and the webserver.
  - Server-side JavaScript like Node.js supports functions to read/write arbitrary files, perform network requests, etc.

- JavaScript's abilities in the browser are limited for the sake of a user's safety.

  - JavaScript can work with files, but the access is limited and only provided if the user does certain actions like uploading a file.
  - JavaScript can interact with camera/microphone and other devices, but they require a user's explicit permission.
  - Different tabs/windows generally do not know about each other except when a window uses JavaScript to open the other one. This is called the "Same Origin Policy" and to work around that both pages must agree for data exchange and contain a special JavaScript code that handles it.
  - JavaScript can easily communicate over the net to the server where the current page came from but its ability to receive data from other sites is crippled.

### References

- [An introduction to JavaScript](https://javascript.info/intro)
