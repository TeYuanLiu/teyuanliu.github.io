---
title: "How to build a React app using JSX, Babel, Webpack, and NPM?"
date: 2021-08-20
excerpt: "Create a React app using JSX syntax with Babel as the JSX transpiler, Webpack as the module bundler, and NPM as the package manager."
categories:
tags: React JSX Babel Webpack NPM
---

From [React website](https://reactjs.org/docs/add-react-to-a-website.html) we know that we can run a React app written in JSX by adding three `<script>` tags into the HTML page and adding `type="text/babel"` attribute to the `<script>` tag which introduces the app `react_app.js` just like the following.

<div class="codeblock-label">index.html</div>

```
<body>
    <!-- load React -->
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>

    <!-- load React DOM -->
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

    <!-- load Babel -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <!-- load our React app -->
    <script type="text/babel" src="react_app.js"></script>

</body>
```

This approach can build our React app in a minute so it is good for development. However, it is not suitable for production.

Here, we are gonna build our app from scratch using Babel as the JSX transpiler, Webpack as the module bundler, and NPM as the package manager. This is a production-ready setup and tools like create-react-app actually use this setup under the hood.

Let's get started.

### Install NVM and Node.js

If we already have Node.js installed then we can skip this step.

Otherwise, open a terminal and run the following commands to first install [NVM](https://github.com/nvm-sh/nvm) and then use it to install the latest long-term-support version of Node.js and a compatible version of NPM.

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.2/install.sh | bash
$ nvm install --lts
```

Check the version of Node.js and NPM installed.

```
$ node -v
$ npm -v
```

### Create a NPM project

We create our project root directory `my-app` and then change directory into it to initialize a NPM project.

In the NPM command, the `-y` flag tells the generator to use the default settings instead of asking questions. We can always change the settings later by editing `package.json`.

```
$ mkdir my-app
$ cd my-app
$ npm init -y
```

### Create a hello-world app

Within the project directory, let's a subdirectory, `src`. We will store our source files (HTML, CSS, JavaScript) inside `src`.

```
$ mkdir src
```

We change directory into `src` and start building our HTML file, `index.html`.

```
$ cd src
$ vi index.html
```

The HTML file is simple and only a `<div>` tag is created to serve as a mount point for our React app.

<div class="codeblock-label">src/index.html</div>

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>React app</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

We next create the CSS file, `style.css`.

```
$ vi style.css
```

Inside the file, we change the color of `<h1>` tags to red.

<div class="codeblock-label">src/style.css</div>

```
h1 {
  color: red;
}
```

Then we create our React app, `app.js`.

```
$ vi app.js
```

The React app simply renders a `Hello World` message on the page. Note that we import the `style.css` here such that later on Webpack will know its existence.

<div class="codeblock-label">src/app.js</div>

```
import React from "react";
import ReactDOM from "react-dom";

import "./style.css";

class Message extends React.Component {
  render() {
    return <h1>{this.props.value}</h1>;
  }
}

ReactDOM.render(
  <Message value="Hello World" />,
  document.getElementById("app")
);
```

### Create Webpack config

We then change directory back to the project root and create our Webpack config.

```
$ cd ../
$ vi webpack.config.js
```

Inside the config, we specify our React app `app.js` as the entry point for Webpack to start building the bundle.

We also tell Webpack to store the bundle as `dist/app.bundle.js` by specifying the output.

Inside module rules, we inform Webpack to load Babel to transpile the JavaScript code and load style for the CSS rules.

Lastly, we instruct Webpack to use the HTML plugin to inject the bundled script into the source HTML file and output the result as `dist/index.html`.

<div class="codeblock-label">webpack.config.js</div>

```
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src", "app.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
};
```

### Modify package.json

Next, we add `webpack` into `package.json` so we can run command `npm run build` to use NPM to run the build with Webpack.

```
$ vi package.json
```

<div class="codeblock-label">package.json</div>

```
"scripts": {
  "build": "webpack"
},
```

### Install dependencies

We need to install our dependencies.

We first install `react` and `react-dom` as they are required to run our application.

Then we install the other packages with a `--save-dev` flag to indicate that these packages are development dependencies and should NOT be bundled into our production bundle.

```
$ npm install react react-dom
$ npm install --save-dev @babel/core babel-loader @babel/preset-react webpack webpack-cli css-loader style-loader html-webpack-plugin
```

### Build

Finally we use NPM to start the build.

```
$ npm run build
```

Webpack should output `index.html` and `app.bundle.js` into the `dist` directory. Open `dist/index.html` in a browser to see our `Hello World`!

### References

- [Setup react with webpack and babel](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9#9b0c)
- [Setup React with webpack 3, babel and NPM](https://blog.jakoblind.no/react-with-webpack-babel-npm/)
- [Node Package Manager Guide: Install npm + Use Commands & Modules](https://www.sitepoint.com/npm-guide/)
- [Installing Multiple Versions of Node.js Using nvm](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/)
