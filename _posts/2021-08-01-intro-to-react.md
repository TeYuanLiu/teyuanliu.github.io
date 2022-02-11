---
title: "What is React and how to use it to develop apps?"
date: 2021-08-01
excerpt: "I followed the official tutorial to build an interactive tic-tac-toe game app. Here is what I have learned."
categories:
tags: JavaScript React
---

Today, I was learning React with its official tutorial to [build an interactive tic-tac-toi game app](https://reactjs.org/tutorial/tutorial.html) and how to [add it to my website](https://reactjs.org/docs/add-react-to-a-website.html). Here is my learning notes.

### Overview

- React is a declarative, efficient, and flexible JavaScript library for **building user interfaces**. It lets you compose complex UIs from small and isolated pieces of code called "components". We use components to tell React what we want to see on the screen. When our data changes, React will update and re-render our components.

- React component class, takes in parameters, called `props` (properties), and return a React element to display via `render` method.

  - A React element is a lightweight description of a hierarchy of views, just like a HTML element. React takes the element and displays the result.

- Most React developers use a special syntax called "JSX" which makes these structures easier to write. The code written using JSX gets transformed to `React.createElement()` at build time.

- A React component can render built-in DOM components like `<div />` or custom React components as well. Each React component is encapsulated and can operate independently; this allows you to build complex UIs from simple components.

- Passing props is how information flows in React apps, from parents to children. React components can have state by setting `this.state` in their constructors. `this.state` should be considered as private to a React component that it's defined in.

- In JavaScript classes, you need to always call `super` when defining the constructor of a subclass. All React component classes that have a `constructor` should start with a `super(props)` call.

- By calling `this.setState` from an `onClick` handler in the `render` method, we tell React to re-render the component whenever its `<button>` is clicked. When you call `setState` in a component, React automatically updates the child components inside of it too.

### Completing the game

- To collect data from multiple, children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component. Lifting state into a parent component is common when React components are refactored.

- The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component.

- A component that receives values from its parent component and inform its parent when an event happens on it is called a "controlled component".

- Data immutability is important

  - There are generally two approaches to changing data. The first approach is to mutate the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes. The end result is the same but by not mutating or changing the underlying data directly, we gain several benefits described below.

    - Complex features become simple:

      Immutability makes complex features much easier to implement such as the ability to undo and redo certain actions. Avoiding direct data mutation lets us keep previous versions intact and available for later reuse.

    - Detecting changes:

      Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed. On the other hand, this detection in mutable objects is difficult as it requires the mutable object to be compared with previous copies of itself and the entire object tree to be traversed.

    - Determining when to re-render in React:

      The main benefit of immutability is that it helps you build pure components in React. Immutable data can easily determine if changes have been made, which helps to determine when a component requires re-rendering.

- Function components are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

- It is strongly recommended that you assign proper keys whenever you build dynamic lists. Note that if no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Keys do not need to be globally unique; they only need to be unique between components and their siblings.

### Wrapping up

That's it! Throughout this tutorial, I have learned concepts like elements, components, props, and state. Can't wait to extend my knowledge on this and build more apps!
