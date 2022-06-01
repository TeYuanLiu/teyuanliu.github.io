---
title: "How to write LeetCode problem count per tag information into JavaScript array and download it as CSV?"
excerpt: "A piece of code can help you download a csv file about Leetcode problem count per tag for your analysis."
categories:
tags: JavaScript Array CSV
---

Today, I was browsing [LeetCode website](https://leetcode.com/problemset/algorithms/) and wanted to make a csv that summarizes the number of problems per tag.

As someone who is learning web development, my instinct is to write some JavaScript code in the browser console to extract the information for me. Therefore, after reading some [reference](https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side), the following is my code snippet to do the trick.

```
// using the browser dev tools, we can find the element attributes of these tags and select one as our search criteria
// I use class name as my search criteria here
let names = document.getElementsByClassName("whitespace-nowrap  group-hover:text-blue dark:group-hover:text-dark-blue text-label-1 dark:text-dark-label-1");
let tags = [];
for (let name of names) {
  tags.push([name.textContent, name.nextSibling.textContent]);
}
let csv = "data:text/csv;charset=utf-8," + tags.map(tag => tag.join(",")).join("\n");
let uri = encodeURI(csv);
window.open(uri);
```

If we want to name the file, replace the last line `window.open(uri)` with the following.

```
let link = document.createElement("a");
link.setAttribute("href", uri);
link.setAttribute("download", "myData.csv");
document.body.appendChild(link);
link.click();
```

After execution of the above code, the browser downloads the file for us.

Feel the power of Automation!
