---
title: 'How to fix "no implicit conversion of Hash into integer" error when running "bundle exec jekyll serve"?'
excerpt: "Here is a hotfix for the error."
categories:
tags: Jekyll
---

### What steps did I take and what happened

I tried to run `bundle exec jekyll serve` to serve my Jekyll site but got error saying `no implicit conversion of Hash into Integer`.

### What did I expect to happen

I expect to successfully serve Jekyll website locally.

### Environment

- OS: Ubuntu 22.04 LTS
- Ruby: 3.0.2p107
- Jekyll: 4.3.2
- Bundler: 2.2.20

### Solution

This error emerged as Ruby 3.0 deprecated using the last argument as keyword arguments so we have to modify the code at `/path/to/your/pathutil-0.16.2/lib/pathutil.rb` to unpack the keyword arguments.

Inside a terminal, simply run

```
sed -i 's/, kwd/, **kwd/g' /path/to/your/pathutil-0.16.2/lib/pathutil.rb
```

to replace every instance of `, kwd` with `, **kwd`.

Try running `bundle exec jekyll serve` again. Some may encounter another error saying `cannot load such file -- webrick`. Just run `bundle add webrick` to fix it.

### References

- [Jekyll serve throws 'no implicit conversion of Hash into Integer ' error](https://stackoverflow.com/questions/66113639/jekyll-serve-throws-no-implicit-conversion-of-hash-into-integer-error)
