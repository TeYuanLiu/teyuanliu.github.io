+++
title = "Markdown"
date = 2025-04-13
updated = 2025-12-27
+++

Markdown is a simple way to format text. Here I documented some best practices I found in the [Google Markdown style guide].
<!-- more -->

[Google Markdown style guide]: https://google.github.io/styleguide/docguide/style.html

## Syntax

Read the [Commonmark](https://commonmark.org/help/) or [Markdown cheatsheet].

[Markdown Cheatsheet]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

## Capitalization

Use the original name of a software product, preserving its capitalization.

## Table of contents (TOC)

Place the TOC before the first H2 heading.

## Document layout

Here is a good example of the document layout.

```
# Document Title

Short introduction.

TOC

## Topic

Content.

## References

* Link-to-more-info
```

## Character line limit

Markdown content follows the residual convention of an 80-character line limit.

### Exception

Exceptions to the 80-character rule include:

-   Headings
-   Links
-   Code blocks
-   Tables

## Heading

### Unique and complete heading name

Use unique and fully descriptive names for each heading, even for sub-sections, as anchor links are automatically-constructed from them.

Prefer:

```
## Foo
### Foo summary
### Foo example
```

over:

```
## Foo
### Summary
### Example
```

### Single H1 heading

Only the document title and nothing else should use the H1 heading.

## List

### Lazy numbering

For a long list that may change its list item order, lazy numbering saves the time for updating list item numbers. In other cases, using explicit numbering is ok.

### Nested list spacing

When nesting lists, use a 4-space indent for both numbered and bulleted lists. When lists are not nested and small, one space can suffice for both cases.

## Code

### Inline

Use inline code when referring to a short code quotation, field name, or file type.

### Code block

For a code quotation longer than a single line, use a fenced code block for language syntax highlighting support, less ambiguity, and better search result.

````
```python
def hello_world():
    print("Hello, world!")
```
````

### Escape newline

Escape any newline with a backslash for shell commands as they are most likely will be copied and pasted into a terminal.

````
```shell
foo --bar=longlonglonglonglonglonglongvalue \
--baz=longlonglonglonglonglonglongvalue
```
````

### Code block within list

Indent the code block within a list to preserve the list structure.

## Link

Shorten a link if it's too long as a long link is difficult to read and may break the 80-character wrapping.

### Relative path link

Avoid using a relative path that requires a `../` inside the link. Use a relative path for a same-directory file is ok.

### Informative Markdown link title

Give a link a meaningful title and avoid using "here", "link", or duplicating the target URL as doing so gives basically zero information.

## Reference

### Reference link

Use a reference link when an inline link's length decreases the readability of the surrounding text, or when the link is used multiple times.

### Reference link definition

Put the definition of a reference link at the end of the section in which it's first used, and right before the next heading. This practice prevents "footnote overload" at the bottom of the file, which makes it difficult to pick out the relevant link destination. However, a reference link that is used in multiple sections should go to the end of the document to prevent potential link dangling.

## Image

Use an image only if it's easier to show a reader something than to describe it such as a flowchart of UI.

## Table

Use a table when the data distribution is relatively uniform across two dimensions and there are many parallel items with distinct attributes. Otherwise, subheading plus list is often suffice to present the same information.

## References
