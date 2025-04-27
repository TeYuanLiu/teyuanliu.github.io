+++
title = "Bootstrap"
date = 2025-04-25
+++

Bootstrap is a powerful, feature-packed frontend toolkit that includes pre-built CSS styles and JavaScript components. We can build prototypes and production-grade frontend in minutes.

## Installation

Import Bootstrap's CSS and JavaScript assets into our HTML file.

## CSS

Bootstrap organizes components through 3 layers:
1.  Container
    -   Add `container` class.
1.  Row
    -   Add `row` class.
    -   Use Flexbox.
    -   Each row has 12 column spaces available for allocation.
1.  Column
    -   Add 'col' class.
    -   Use `col-6` to let a column takes 6 out of the 12 available column spaces.
    -   Use `col` or `col-auto` to make a column figure out its width.
    -   Use `col-xl-2 col-lg-4 col-5` to set multiple break points. The column will take 2 column spaces when display width reaches `XL`, 4 column spaces when reaches `LG`, and 5 column spaces otherwise.
    -   Use `offset-7` to make the column shift 7 column spaces to the right from the previous column.

By just adding the pre-built `container` class to a `div` tag, Bootstrap automatically scales the content font size, padding, and margin in responding to display size changes.