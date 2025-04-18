+++
title = "Markdown"
date = 2025-04-13
+++

Markdown is a simple way to format text. Here I documented some good points I found in the [Google Markdown style guide].

[Google Markdown style guide]: https://google.github.io/styleguide/docguide/style.html

## Syntax

Read the [Commonmark](https://commonmark.org/help/) or [Markdown Cheatsheet].

[Markdown Cheatsheet]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

## Capitalization

Use the original names of products and software, preserving the capitalization.

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

## See also

* Link-to-more-info
```

## Character line limit

Markdown content follows the residual convention of an 80-character line limit.

### Exceptions

Exceptions to the 80-character rule include:

- Links
- Tables
- Headings
- Code blocks

## Headings

### Use unique, complete names for headings

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

### Use a single H1 heading

Use one H1 heading as the title of the document.

## Lists

### Use implicit numbering for long list and explicit otherwise

For long lists that may change, implicit, or lazy numbering is quite useful.

### Nested list spacing

When nesting lists, use a 4-space indent for both numbered and bulleted lists. When lists are not nested and small, one space can suffice for both cases.

## Code

### Inline

Use inline code when referring to short code quotations, field names, or file types.

### Code blocks

For code quotations longer than a single line, use a fenced code block for language syntax highlighting support, less ambiguity, and better search result.

````
```python
def hello_world():
    print("Hello, world!")
```
````

### Escape newlines

Escape any newline with a backslash for shell commands as they are most likely will be copied and pasted into a terminal.

````
```shell
foo --bar=longlonglonglonglonglonglongvalue \
--baz=longlonglonglonglonglonglongvalue
```
````

### Nest code blocks within lists

Indent the code block within a list to preserve the list structure.

## Links

Shorten the links as long links are difficult to read and break the 80 character wrapping.

### Avoid relative paths unless within the same directory

Avoid relatives links that requires a `../` inside the link.

### Use informative Markdown link titles

Give links meaningful titles and avoid using "here", "link", or duplicating the target URL as doing so gives basically zero information.

## Reference

### Use reference links for long links or duplication reduction

Use reference links when the length of the link would detract from the readability of the surrounding text if it were inlined, or when the link is used multiple times.

### Define reference links after their first use

Put reference link definitions just before the next heading, at the end of the section in which they're first used. This practice prevents "footnote overload" at the bottom of the file, which makes it difficult to pick out the relevant link destination. However, reference links that are used in multiple sections should go at the end of the document to prevent potential dangling links.

## Images

Use images only if it's easier to show a reader something than to describe it such as a flowchart of UI.

## Tables

Use tables when the data distribution is relatively uniform across two dimensions and there are many parallel items with distinct attributes. Otherwise, subheadings and lists are often suffice to present the same information.

## See also
