---
title: "How to write math equations in a Jekyll website using MathJax?"
date: 2022-02-03
excerpt: "The first step to become a master in mathematics is to know how to write math equations in your blog."
categories:
tags: Github-Pages Jekyll MathJax
---

You wanna write complicated math equations on your Jekyll website? Here is the right place for you.

MathJax is a JavaScript library that displays mathematical notation in web browsers and we can use it within **two steps**. Let's get started.

### Create a HTML file to import the MathJax script

First, we create a new file called `mathjax.html` and put it inside the folder `_includes` of your Jekyll project. Create the `_includes` folder as well if you don't have one.

<div class="codeblock-label">_includes/mathjax.html</div>

```
{% raw %}{%- if page.mathjax != false -%}
<script
  type="text/javascript"
  src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
></script>
{%- endif -%}{% endraw %}
```

### Include the HTML file in a layout file

Then, we include the `mathjax.html` inside the layout file we want to give math equation writing functionality. For me it is the `post.html` inside the `_layouts` folder. Also set `mathjax` to `true` in the front matter then we are good to go!

<div class="codeblock-label">_layouts/post.html</div>

```
{% raw %}---
mathjax: true
---

{%- include mathjax.html -%}{% endraw %}
```

That's it! Now we can write math formulas freely on a Jekyll website.

### References

- [MathJax](https://www.mathjax.org/#gettingstarted)
