var disqus_config = function () {
  this.page.url = pageAbsoluteUrl;
  this.page.identifier = pageAbsoluteUrl;
};

(function () {
  var d = document,
    s = d.createElement("script");
  s.src = "https://" + siteDisqusShortname + ".disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
})();
