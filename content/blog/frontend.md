+++
title = "Frontend"
date = 2025-05-01
updated = 2025-11-07
+++

## CSS

### Sass

[Sass](https://sass-lang.com/) is a CSS extension language that makes CSS property management easier. 

#### Variable

Variables are meant to store CSS values that will be reused like colors or font stacks. A variable can be declared using the `$` symbol. When the Sass is processed, variables are substituted with their values to output normal CSS.

#### Nesting

Nesting CSS selectors lets us mimic the hierarchy of a HTML DOM tree. Note that overly nested rules often introduce over-qualified CSS and are hard to debug so be cautious when using nesting.

#### Mixin

A mixin defines the template of a set of CSS declarations. We can pass in values to a mixin to make it even more flexible.

#### Inheritance

Inheritance lets us share a fixed set of CSS properties, so it's less flexible compared with mixins. A class that holds the CSS properties is called the placeholder class. A CSS selector can include the placeholder class's CSS properties by inheriting/extending it. A placeholder class only prints when it is inherited/extended.

## Response time optimization

-   Code pruning
    -   Optimize the final JS bundle by removing dead code that will never be used.
-   Code splitting
    -   Split a large application bundle into multiple smaller bundles for efficient loading.
-   Dynamic code imports
    -   Load code modules dynamically based on user actions to optimize the initial loading times.
-   Compression
    -   Compress files and minimize data size before transmission to reduce network load.
-   Priority-based loading
    -   Prioritize essential resources and content that are visible above the fold for a better user experience.
-   Pre-fetching
    -   Proactively fetch and cache resources that are likely to be needed soon.

## See also
