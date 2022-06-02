---
title: "JavaScript 5 - Hello, world!"
excerpt: "From JavaScript."
categories:
tags: JavaScript
---

### Summary

- We use a `<script>` tag to add JavaScript code to a page.

- Most of the time, we save complex script in a separate file such that the browser can download it once and store it in its cache for reuse.

- The external script file can be inserted with `<script src="path/to/script.js"></script>`.

### Tasks

- Show an alert

  ```
  <!DOCTYPE html>
  <html>
  <body>
    <script>
      alert("I'm JavaScript!")
    </script>
  </body>
  </html>
  ```

- Show an alert with an external script

  ```
  <!DOCTYPE html>
  <html>
  <body>
    <script src="./alert.js"></script>
  </body>
  </html>
  ```

  <div class="codeblock-label">alert.js</div>

  ```
  alert("I'm JavaScript!")
  ```

### References

- [Hello, world!](https://javascript.info/hello-world)
