+++
title = "Zola"
date = 2025-04-13
updated = 2025-12-28
+++

Zola is a static site generator (SSG) written in [Rust](https://www.rust-lang.org/) and uses the [Tera](https://keats.github.io/tera/) template engine. Zola uses [pulldown-cmark](https://github.com/raphlinus/pulldown-cmark#pulldown-cmark) to parse content written in [CommonMark](https://commonmark.org/) specification of [Markdown](https://www.markdownguide.org/). Zola prioritizes ease of use, super fast build, simple templating, and is suitable for minimalistic and fast dev blog.
<!-- more -->

## Content

### Section

Zola uses the directory structure to determine the site structure. Each child directory in the `content` directory represents a section if it contains an `_index.md` file. The `_index.md` file stores both the metadata and the content of a section. For example, the content in `content/blog/_index.md` is shown on `https://mywebsite.com/blog/`. If a directory doesn't contain an `_index.md` file, no section will be created, but Markdown files within that directory will still create pages (known as orphan pages). Note that the `content` directory itself creates a main content section, regardless the existence of an `_index.md` file inside the directory, and if `content/_index.md` is created, its content is shown on `https://mywebsite.com/`.

#### Front matter

The TOML front matter is used to embed [a set of metadata] at the beginning of a file enclosed by triple pluses (`+++`). Content added after the closing `+++` will be parsed as Markdown and accessible through the `section.content` variable in the templates.

YAML front matter formatted by triple minuses (`---`) is also supported.

[a set of metadata]: https://www.getzola.org/documentation/content/section/#front-matter

#### Sorting

Posts will be iterated over in the order specified by the `sort_by` variable set in the `_index.md` file of the section. The `sort_by` variable can be set to one of these values: `date`, `update_date`, `title`, `title_bytes`, `weight`, `slug`, or `none`.

#### Asset colocation

Zola supports asset colocation with sections and pages.

A page with co-located assets should be placed as an `index.md` in a dedicated directory (`content/blog/foo/index.md`) instead of in the section directory (`content/blog/foo.md`). By default, the page slug will be the directory name and thus its permalink will be `https://mywebsite.com/blog/foo/`.

All non-Markdown files added in a section/page directory will be copied alongside the generated page when the site is built, which allows accessing them with a relative path. Note that we can use `ignored_content` in the config file to ignore selected asset files.

#### Static assets

All files/directories placed in the `static` directory will be copied to the `public` directory. These files won't be parsed as Markdown files.

A common use case is putting site-wide assets (CSS files, site logos and JavaScript files) under `static` and use an absolute path to access the assets.

Note that zola supports colocation between `content` and `static` if the subpaths are the same. That is, we can use relative path to access `static/blog/zola/logo.svg` from `content/blog/zola/index.md`.

#### Pagination

Enable pagination for a section's pages by setting `paginate_by` to a positive number.

#### Drafting

Sections and pages can be drafted by setting the `draft` option in the front matter. When a section is drafted its descendants like subsections, pages, and assets will not be processed unless the `--drafts` flag is passed.

### Page

A page is any Markdown file that is not `_index.md` within the `content` directory. Note that a `index.md` file will generate a page with the name of its directory. For example `content/about/index.md` will create a page at `https://mywebsite.com/about`.

#### Front matter

We can set the [page front matter] as well.

[page front matter]: https://www.getzola.org/documentation/content/page/#front-matter

### Shortcode

Zola borrows the concept of shortcode from WordPress to cover two distinct use cases:
-   Inject more complex HTML like inline HTML or styling.
-   Display external data in a page's body without repetitive tasks.

#### Limitations

Shortcode has several limitations:
-   The shortcode name and any argument name can only contain letters, numbers, and underscores (`^[A-Za-z_][A-Za-z_0-9]+$`).
-   The argument parentheses are required.
-   All arguments are required.
-   Shortcodes are rendered before the page's Markdown is parsed so they don't have access to Tera variables, the page's table or contents, or global functions like `get_page`, `get_section`, `get_taxonomy`, etc.
-   Concatenation and other operators are unavailable.

If a shortcode is invalid it will get rendered directly into the final HTML instead of being processed.

#### Shortcode without body and arguments

One basic shortcode example is a shortcode without body and arguments. We can create a file named `withoutbodywithoutarguments.html` in the `templates/shortcodes` directory, which has the following content.
{% codeblocktag () %}
templates/shortcodes/withoutbodywithoutarguments.html
{% end %}
```html
<div>
    My message.
</div>
```
Zola will recognize this template as a shortcode named `withoutbodywithoutarguments`. We can then use it in any Markdown file as if it was a Tera function in a variable block.
```
{{/* withoutbodywithoutarguments() */}}
```

#### Shortcode with body and without arguments

We can create a file named `withbodywithoutarguments.html` in the `templates/shortcodes` directory, which has the following content.
{% codeblocktag () %}
templates/shortcodes/withbodywithoutarguments.html
{% end %}
```html
<div>
    {{ body }}
</div>
```
And then use it in any Markdown files.
```
{%/* withbodywithoutarguments() */%}
My message.
{%/* end */%}
```

#### Shortcode without body and with arguments

Shortcode accepts five types of arguments:
-   string surrounded by single quotes, double quotes, or backticks
-   bool that is either `true` or `false`
-   integer
-   float
-   array of any kind of value except array itself so we cannot have nested arrays

Malformed values will be silently ignored.

We can create a file named `withoutbodywitharguments.html` in the `templates/shortcodes` directory, which has the following content.
{% codeblocktag () %}
templates/shortcodes/withoutbodywitharguments.html
{% end %}
```html
<div>
    {{ message }}
</div>
```
And then use it in any Markdown files.
```
{{/* withoutbodywitharguments(message="My message") */}}
```

#### Shortcode with body and arguments

We can create a file named `withbodywitharguments.html` in the `templates/shortcodes` directory, which has the following content.
{% codeblocktag () %}
templates/shortcodes/withbodywitharguments.html
{% end %}
```html
<div>
    {{ body }}
    {{ message }}
</div>
```
And then use it in any Markdown files.
```
{%/* withbodywitharguments(message="My message") */%}
My body.
{%/* end */%}
```

#### Escaping

We can escape rendering content that looks like a shortcode by using `{{/*` and `*/}}` instead of `{{` and `}}`, and `{%/*` and `*/%}` instead of `{%` and `%}`.

#### Example

##### YouTube

We can put a `youtube.html` file in the `templates/shortcodes` directory with the below content.
{% codeblocktag () %}
templates/shortcodes/youtube.html
{% end %}
```html
<div {% if class %}class="{{class}}"{% endif %}>
    <iframe
        src="https://www.youtube.com/embed/{{id}}{% if autoplay %}?autoplay=1{% endif %}"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen>
    </iframe>
</div>
```

Zola now recognizes this template as the `youtube` shortcode that wraps an iframe pointing to a YouTube URL in a `<div>`.

The Markdown renderer wraps an inline HTML node into a paragraph but we can disable this behavior by wrapping the shortcode in a `<div>`.

##### Books

We can create `books.md` in `templates/shortcodes` with the below content.
{% codeblocktag () %}
templates/shortcodes/books.md
{% end %}
```md
{% set data = load_data(path=path) -%}
{% for book in data.books %}
### {{ book.title }}
{{ book.description | safe }}
{% endfor %}
```

Zola creates a shortcode `books` that takes in the `path` argument, which points to a `.toml` file, so it can load lists of books with titles and descriptions.

#### Extra variables

-   `nth`
    -   Every shortcode can access the number of times this shortcode has been invoked in the current Markdown file in the `nth` variable. This is useful when implementing custom markup for side-notes.
-   `lang`
    -   Every shortcode can access the current language in the `lang` variable.
-   `page` or `section`
    -   Every shortcode can access a slightly stripped down version of the `page` and `section` variable in the normal templates.
    -   A useful attribute to `page` in shortcodes is `colocated_path`, which can be used to aggregate the directory path and the name of a colocated asset.

### Link

When rendering the Markdown content, each heading will be automatically assigned a unique id, obtained by converting the heading text to a slug through processes like whitespace replacement and special character stripping.

We can manually specify an id as well as CSS classes using a `{#id-placeholder .class-placeholder}` suffix in the heading line.

#### Anchor link

We can generate anchor link for a heading by setting the `insert_anchor_links` variable on the section front matter page.

#### Internal link

To link to a page or a heading in a page, create a link using `@/` to point to the target Markdown file and `#` for the target heading. Note that the path to the file starts from the `content` directory (therefore `@/blog/post.md` links to `content/blog/post.md`).

Broken internal links are treated as errors.

### Table of contents

Each section or page automatically generates a table of contents for itself based on the headers generated with Markdown and is available in the template through variables like `page.toc` and `section.toc`.

### Syntax highlighting

We can enable Zola's built-in syntax highlighting by configuring it in `config.toml`.

```
highlight_code = true
```

Below is a list of supported languages and their short-names.

-   Shell: sh
-   Bourne Again Shell (bash): bash
-   C: c
-   C++: c++, cpp
-   CSS: css
-   Dockerfile: dockerfile
-   Go: go
-   GraphQL: graphql, gql
-   HTML: html
-   Java: java
-   JavaScript: js
-   JSON: json
-   Kotlin: kt
-   Makefile: makefile, make
-   Markdown: markdown, md
-   PHP: php
-   Python: py
-   Rust: rs
-   SCSS: scss
-   SQL: sql
-   Swift: swift
-   TOML: toml, tml
-   TypeScript: ts
-   YAML: yaml, yml

#### Inline vs classed highlighting

We can choose to use a highlighting scheme to get the colors directly encoded in the html file, or use the `css` color scheme to apply the CSS class definitions and thus enable dynamic switching of the highlighting theme.

#### Annotations

We can use additional annotations to customize how code blocks are displayed:
-   `linenos` to enable line numbering.
-   `linenostart` to specify the line number of the first line.
-   `hl_lines` to highlight lines.
-   `hide_lines` to hide lines.
-   `name` to specify a name the code block is associated with.

### Taxonomies

Taxonomies are a way for us to group content according to custom-defined categories.

-   A taxonomy is a category that can be used to group content.
-   A term is a specific group within a taxonomy.
-   A value is a piece of content that can be associated with a term.

### Search

Zola can build a search index from the sections and pages content to be used by a JavaScript library such as elasticlunr or fuse.

### Sass

[Sass](@/blog/web-application.md#sass) is a popular CSS preprocessor that adds special features like variables and nested rules to facilitate the maintenance of large sets of CSS rules.

## Template

Zola uses the Tera template engine.

Here are a few variables available on all templates except feeds and the sitemap:
-   `config`
-   `current_path`
-   `current_url`
-   `lang`

### Standard template

Zola looks for three standard templates:
-   `index.html` which is applied to the site homepage
-   `section.html` which is applied to all sections (any HTML page generated by creating a directory within the `content` directory)
-   `page.html` which is applied to all pages (any HTML page generated by creating an Markdown file within the `content` directory)

The homepage is a section so `index.html` also has access to the section variables just like `section.html`. The `page.html` template has access to the page variables.

### Custom template

We can create custom templates by creating an HTML file inside the `templates` directory (or its subdirectories). A custom template will be used when its path within the `templates` directory is explicitly specified in a page's `template` front-matter variable (or if it is included in another template that is applied).


### Section

By default, Zola tries to load `templates/index.html` for `content/_index.md` and `templates/section.html` for other `_index.md` files.

Here are some common section variables available in the template:
-   title
-   content
-   pages

### Page

Here are some common page variables available in the template:
-   title
-   content
-   toc
-   date
-   updated
-   reading_time
-   lower
-   higher
-   draft
-   description
-   summary
-   taxonomies

### Table of contents

Both section and page template have a `toc` variable that corresponds to an array of headers. A header has the following fields:
-   title
-   children
-   level
-   id
-   permalink

## References
