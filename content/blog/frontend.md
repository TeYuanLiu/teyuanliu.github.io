+++
title = "Frontend"
date = 2025-05-01
updated = 2025-12-27
+++

## Cascading Style Sheets (CSS)

### Sass

[Sass](https://sass-lang.com/) is a CSS extension language that makes CSS property management easier.

#### Variable

A variable is meant to store a CSS property value that will be reused like color or font stack. A variable can be declared using the `$` symbol. When a Sass file is being processed, its variables are substituted with their values to output a normal CSS.

#### Nesting

Nesting CSS selectors lets us mimic the hierarchy of a HyperText Markup Language (HTML) Document Object Model (DOM) tree. Note that overly-nested rules often introduce over-qualified CSS and are hard to debug so be cautious when using nesting.

#### Mixin

A mixin defines the template of a set of CSS declarations. We can pass in values to a mixin to make it even more flexible.

#### Inheritance

Inheritance lets us share a fixed set of CSS properties, so it's less flexible compared with mixins. A class that holds the CSS properties is called the placeholder class. A CSS selector can include the placeholder class's CSS properties by inheriting/extending it. A placeholder class only prints when it is inherited/extended.

## Bootstrap

Bootstrap is a powerful, feature-packed frontend toolkit that includes pre-built CSS styles and JavaScript components. We can build prototypes and production-grade frontend in minutes.

### Installation

Import Bootstrap's CSS and JavaScript assets into our HTML file.

### CSS

Bootstrap organizes components through 3 layers:
1.  Container (top-layer)
    -   Add `container` class.
1.  Row
    -   Add `row` class.
    -   Use Flexbox.
    -   Each row has 12 column spaces available for allocation.
1.  Column
    -   Add `col` class.
    -   Use `col-6` to let a column takes 6 out of the 12 available column spaces.
    -   Use `col` or `col-auto` to make a column figure out its width.
    -   Use `col-xl-2 col-lg-4 col-5` to set multiple break points. The column will take 2 column spaces when display width reaches `XL`, 4 column spaces when reaches `LG`, and 5 column spaces otherwise.
    -   Use `offset-7` to make the column shift 7 column spaces to the right from the previous column.

By just adding the pre-built `container` class to a `div` tag, Bootstrap automatically scales the content font size, padding, and margin in responding to display size changes.

## Response time optimization

-   Code pruning
    -   Optimize the code bundle by removing dead code that will never get executed.
-   Code splitting
    -   Split the bundle into multiple smaller bundles for efficient loading.
-   Dynamic code imports
    -   Load  bundles dynamically based on the user action to optimize the initial loading time.
-   Compression
    -   Compress files and minimize data size before transmission to reduce network load.
-   Priority-based loading
    -   Prioritize essential contents that are visible above the fold for a better user experience.
-   Pre-fetching
    -   Proactively fetch and cache resources that are likely to be needed soon.

## References
