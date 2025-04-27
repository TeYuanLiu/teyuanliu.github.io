+++
title = "Zola"
date = 2025-04-13
+++

Zola is a static site generator (SSG) written in [Rust](https://www.rust-lang.org/) and uses the [Tera](https://keats.github.io/tera/) template engine. Zola uses [pulldown-cmark](https://github.com/raphlinus/pulldown-cmark#pulldown-cmark) to parse content written in [CommonMark](https://commonmark.org/) specification of [Markdown](https://www.markdownguide.org/). Zola prioritizes ease of use, super fast build, simple templating, and is suitable for minimalistic and fast dev blog.

## Content

### Section

Zola uses the directory structure to determine the site structure. Each directory (or subdirectory) in the `content` directory represents a section if it contains an `_index.md` file. The `_index.md` file stores both the metadata and the content of a section. For example, the content in `content/_index.md` is shown in `https://mywebsite.com/`, and the content in `content/blog/_index.md` is shown in `https://mywebsite.com/blog/`. Note that the `content` directory itself creates a main content section, regardless the existence of an `_index.md` file inside the directory.

#### Front matter

The TOML front matter is used to embed [a set of metadata] at the beginning of a file enclosed by triple pluses (`+++`). Content added after the closing `+++` will be parsed as Markdown and accessible through the `section.content` variable in the templates.

YAML front matter formatted by triple minuses (`---`) is also supported.

[a set of metadata]: https://www.getzola.org/documentation/content/section/#front-matter

#### Pagination

Enable pagination for a section's pages by setting `paginate_by` to a positive number.

#### Sorting

Posts will be iterated over in the order specified by the `sort_by` variable set in the `_index.md` file of the section. The `sort_by` variable can be given a few values: `date`, `update_date`, `title`, `title_bytes`, `weight`, `slug`, or `none`.

#### Asset colocation

Zola supports asset colocation with sections and pages.

Pages with co-located assets should be placed as an `index.md` in a dedicated directory (`content/blog/foo/index.md`) instead of directly in their section directory (`content/blog/foo.md`). By default, this page's slug will be the directory name and thus its permalink will be `https://mywebsite.com/blog/foo/`.

All non-Markdown files added in a section/page directory will be copied alongside the generated page when the site is built, which allows accessing them with a relative path. Note that we can use `ignored_content` in the config file to ignore selected asset files.

#### Static assets

All files/directories placed in the `static` directory will be copied to the `public` directory. These files won't be parsed as Markdown files.

A common use case is putting site-wide assets (CSS files, site logos and JavaScript files) under `static` and use an absolute path to access the assets.

Note that zola supports colocation between `content` and `static` if the subpaths are the same. That is, we can use relative path to access `static/blog/zola/logo.svg` from `content/blog/zola/index.md`.

#### Drafting

Sections and pages can be drafted by setting the `draft` option in the front matter. When a section is drafted its descendants like subsections, pages, and assets will not be processed unless the `--drafts` flag is passed.

### Page

A page is any file ending with `.md` but not `_index.md` in the `content` directory. Note that a `index.md` file will generate a page with the name of its directory. For example a `about.md` file in the `content` directory will create a page at `<BASE_URL>/about`.

#### Front matter

We can set [page front matter] as well.

[page front matter]: https://www.getzola.org/documentation/content/page/#front-matter

### Shortcode

Zola borrows the concept of shortcodes from WordPress to cover two distinct use cases:
-   Inject more complex HTML like inline HTML or styling.
-   Display external data in a page's body without repetitive tasks.

There are two kinds of shortcodes:
-   One that takes `body` as an argument.
    Like we can use the below `quote.html` shortcode:
    ```html
    <blockquote>
        {{ body }} <br>
        -- {{ author}}
    </blockquote>
    ```
    inside a Markdown file:
    ```
    As someone said:

    {%/* quote(author="Vincent") */%}
    A quote
    {%/* end */%}
    ```
-   One that does not take `body` as an argument.

Shortcodes are rendered before the page's Markdown is parsed so they don't have access to the page's table or contents, or global functions like `get_page`, `get_section`, `get_taxonomy`, etc.

#### Escaping

You can escape rendering content that looks like a shortcode by using `{{/*` and `*/}}` instead of `{{` and `}}`, and `{%/*` and `*/%}` instead of `{%` and `%}`.

#### Argument

Shortcode accepts five types of arguments:
-   string surrounded by single quotes, double quotes, or backticks
-   bool that is either `true` or `false`
-   integer
-   float
-   array of any kind of value except array itself so we cannot have nested arrays

Malformed values will be silently ignored.

##### Without arguments

Parentheses are required for shortcodes.

We can create an `aside` shortcode defined in `aside.html`:
```html
<aside>
    {{ body }}
</aside>
```
And then use it in our Markdown file:
```
Readers can refer to the aside for more information.

{%/* aside() */%}
An aside
{%/* end */%}
```

#### Limitations

Shortcode has several limitations:
-   All arguments are required
-   The shortcode cannot reference Tera variables
-   Concatenation and other operators are unavailable
-   The shortcode name and any argument name can only contain letters, numbers, and underscores (`^[A-Za-z_][A-Za-z_0-9]+$`).

If the shortcode is invalid it will get rendered directly into the final HTML instead of being processed.

#### Examples

##### YouTube

You can put a `youtube.html` file in the `templates/shortcodes` directory with the below content.

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

Zola now recognizes this template as the `youtube` shortcode that wraps an iframe pointing to an YouTube URL in a `<div>`

The Markdown renderer wraps an inline HTML node into a paragraph but you can disable this behavior by wrapping the shortcode in a `<div>`.

##### Books

You can create `books.md` in `templates/shortcodes` with the below content.
```
{% set data = load_data(path=path) -%}
{% for book in data.books %}
### {{ book.title }}

{{ book.description | safe }}
{% endfor %}
```

Zola creates a shortcode `books` that takes in the `path` argument, which points to a `.toml` file, so it can load lists of books with titles and descriptions.






## See also
