---
title: "How to add Disqus comment to a Jekyll website?"
date: 2021-07-11
excerpt: "Disqus let us set up commenting functionality to our Jekyll website easily."
categories:
tags: Github-Pages Jekyll Disqus
---

Nowadays we have all kinds of web plug-ins available on the Internet, which is lucky for us as we don't have to waste time reinventing the wheel.

The Disqus plug-in enables us to provide commenting functionality on our websites. It supports multiple static site generator and today we are going to test it on Jekyll.

There are two main steps we want to take.

### Sign up Disqus and get a shortname for your website

The first step is to register an account at [Disqus](https://disqus.com/) if you haven't done that yet and create an unique [Disqus shortname](https://help.disqus.com/en/articles/1717111-what-s-a-shortname) for your website.

### Configure Jekyll project settings

With the Disqus shortname in hand, we can move on to the second step, which is configuring Disqus in your Jekyll website directory.
There are three files within the website directory that we need to touch.

The first one is `_config.yml` where we append the following at the end of the file. Remember to replace `<your_website_disqus_shortname>` with your Disqus shortname.

<div class="codeblock-label">_config.yml</div>

```
disqus:
  shortname: <your_website_disqus_shortname>
```

The second one is a new file called `disqus.html` which will reside in folder `_includes`. Create the `_includes` folder as well if you don't have one.

<div class="codeblock-label">_includes/disqus.html</div>

```
{% raw %}{%- if site.disqus.shortname and page.comments != false -%}
<div id="disqus_thread"></div>
<script>
  var disqus_config = function () {
    this.page.url = "{{ page.url | absolute_url }}";
    this.page.identifier = "{{ page.url | absolute_url }}";
  };

  (function () {
    var d = document,
      s = d.createElement("script");
    s.src = "https://{{ site.disqus.shortname }}.disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
{%- endif -%}{% endraw %}
```

#### Alternative for `_includes/disqus.html`

You may choose to put the script content into a separate JavaScript file `disqus.js`, then your `disqus.html` will be like the following. Remember to replace the `src` of the second `<script>` tag to your own `disqus.js` path.

<div class="codeblock-label">_includes/disqus.html</div>

```
{% raw %}{%- if site.disqus.shortname and page.comments != false -%}
<div id="disqus_thread"></div>
<script>
  // because it is hard to access liquid variables in a separate JavaScript file, we store them to some JavaScript variables first.
  let pageAbsoluteUrl = "{{ page.url | absolute_url }}";
  let siteDisqusShortname = "{{ site.disqus.shortname }}";
</script>
<script src="/path/to/disqus.js"></script>
<noscript
  >Please enable JavaScript to view the
  <a href="https://disqus.com/?ref_noscript" rel="nofollow"
    >comments powered by Disqus.</a
  ></noscript
>
{%- endif -%}{% endraw %}
```

And your `disqus.js` will be the following.

<div class="codeblock-label">path/to/disqus.js</div>

```
{% raw %}var disqus_config = function () {
  this.page.url = pageAbsoluteUrl;
  this.page.identifier = pageAbsoluteUrl;
};

(function () {
  var d = document,
    s = d.createElement("script");
  s.src = "https://" + siteDisqusShortname + ".disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
})();{% endraw %}
```

The last file is the layout file in which you want to add the commenting functionality.For me it is the `post.html` inside the `_layouts` folder. Put the `disqus.html` to a place inside `post.html` where we want to see the comments showing up and then set the variable `comments` to `true` inside the front matter and then we are all set!

<div class="codeblock-label">_layouts/post.html</div>

```
{% raw %}---
disqus: true
---

{%- include disqus.html -%}{% endraw %}
```

It's super easy, right? Now we have commenting added to our website without worrying about database server for the comments.

Oh, by the way, if you are using Google Chrome as your browser, remember to have the browser devtools open and check the **Disable cache (while DevTools is open)** box to prevent Chrome from showing you the older version of your website when you run `bundle exec jekyll serve` to build it!

### References

- [Disqus comments setup for Jekyll](https://desiredpersona.com/disqus-comments-jekyll/)
- [HOW TO ADD DISQUS TO YOUR JEKYLL SITE?](https://poanchen.github.io/blog/2017/07/27/how-to-add-disqus-to-your-jekyll-site)
