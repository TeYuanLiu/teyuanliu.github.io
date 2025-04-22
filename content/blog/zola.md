+++
title = "Zola"
date = 2025-04-13
+++

Zola is a static site generator (SSG) written in [Rust](https://www.rust-lang.org/) and uses the [Tera](https://keats.github.io/tera/) template engine. Zola uses [pulldown-cmark](https://github.com/raphlinus/pulldown-cmark#pulldown-cmark) to parse content written in [CommonMark](https://commonmark.org/) specification of [Markdown](https://www.markdownguide.org/). Zola prioritizes ease of use, super fast build, simple templating, and is suitable for minimalistic and fast dev blog.

## Content

### Section

Zola uses the directory structure to determine the site structure. Each child directory in the `content` directory represents a section that contains pages. Note that the `content` directory itself is also a kind of section.

A file named `_index.md` is used to store both the metadata and the content of a section. For example, the content in `content/_index.md` is shown in `https://mywebsite.com/`, and the content in `content/blog/_index.md` is shown in `https://mywebsite.com/blog/`.

#### Asset colocation

Zola supports asset colocation with sections and pages.

Pages with co-located assets should be placed as an `index.md` in a dedicated directory (`content/blog/foo/index.md`) instead of directly in their section directory (`content/blog/foo.md`). By default, this page's slug will be the directory name and thus its permalink will be `https://mywebsite.com/blog/foo/`.

All non-Markdown files added in a section/page directory will be copied alongside the generated page when the site is built, which allows accessing them with a relative path.

### Page

## See also
