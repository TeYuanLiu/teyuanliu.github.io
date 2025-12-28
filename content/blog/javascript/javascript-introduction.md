+++
title = "JavaScript Info 1.1 - Introduction"
date = 2025-12-03
updated = 2025-12-27
tags = ["javascript"]
+++

JavaScript was created as a browser-only language to integrate with HTML/CSS, but nowadays it is used on various devices.
<!-- more -->

## Summary

-   JavaScript has two main advantages:
    -   Full integration with HTML/CSS
    -   Supported by all major browsers
-   In-browser JavaScript:
    -   Can:
        -   Get the user's input via mouse and keyboard actions.
        -   Access camera and microphone with the explicit approval from the user.
        -   Let the user download/upload files.
        -   Manage browser local storage.
        -   Manipulate webpage elements like a DOM tree node.
        -   Interact with servers.
    -   Cannot:
        -   Access kernel functions.
        -   Know the existence of other browser tabs unless one tab uses JavaScript to open another one.
        -   Request data from a server with different origin unless configured.
-   Server-side JavaScript
    -   Can:
        -   Read/write the server's files.
        -   Interact with other servers.
-   The [ECMA-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) specification defines the JavaScript language.
-   The [Mozilla JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript) is the main manual with examples and other information.
-   An editor is a tool for users to edit files fast, elegant, and simple.
    -   Some common examples are Sublime, Vim and Notepad++.
-   An Integrated Development Environment (IDE) refers to the tool that allows a user to work on the scope of the entire project.
    -   It includes not only an editor but also features like directory opening, autocompletion, version control and command line interface.
    -   Some common examples are Visual Studio Code, XCode, Visual Studio, and WebStorm.
-   In-browser developer tools allow users to see errors, run commands and examine variables for debugging. We can open the developer tools by pressing `F12` for Linux and Windows, and `Cmd + Opt + J` for chrome on Mac.

## References

-   [JavaScript introduction](https://javascript.info/getting-started)
