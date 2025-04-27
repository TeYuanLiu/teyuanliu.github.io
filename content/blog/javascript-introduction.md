+++
title = "JavaScript Info 1.1.1 - An introduction to JavaScript"
date = 2025-04-26
tags = ["javascript"]
+++

JavaScript was created as a browser-only language to integrate with HTML/CSS. It positioned itself as a new language as a "younger brother" of the Java language popular at that time, but now it has its own specification called ECMAScript, and it is used not only in servers but also many other environments as well.

## Environments

### Browser

In-browser JavaScript can do everything related to webpage manipulation, interaction with the user, and the webserver, but its capabilities on other things are restrained for the sake of users' safety.

#### Limitations

-   JavaScript can work with files, but the access is limited and only provided if the user does certain actions like uploading a file.
-   JavaScript can interact with camera/microphone and other devices, but they require a user's explicit permission.
-   Different tabs/windows generally do not know about each other except when a window uses JavaScript to open the other one. This is called the "Same Origin Policy" and to work around that both pages must agree for data exchange and contain a special JavaScript code that handles it.
-   JavaScript can easily communicate over the net to the server where the current page came from but its ability to receive data from other sites is crippled. 

### Server

Server-side JavaScript like Node.js supports functions to read/write arbitrary files, perform network requests, etc.

## See also

- [An introduction to JavaScript](https://javascript.info/intro)