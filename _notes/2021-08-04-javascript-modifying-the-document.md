---
title: "JavaScript Info 2.1.7 - Modifying the document"
excerpt: 'DOM modification changes the existing page content "on the fly" and is the key to creating "live" pages.'
categories:
tags: JavaScript Browser Document
index: 97
---

### Summary

- Methods to create new nodes:

  - `document.createElement(tag)` - creates an element with the given tag
  - `document.createTextNode(value)` - creates a text node (rarely used as elem.textContent is more convenient)
  - `elem.cloneNode(deep)` - clones the element, if `deep==true` then with all descendants.

- Insertion and removal:

  - `node.append(...nodes or strings)` - insert into `node`, at the end
  - `node.prepend(...nodes or strings)` - insert into `node`, at the beginning
  - `node.before(...nodes or strings)` - insert right before `node`
  - `node.after(...nodes or strings)` - insert right after `node`
  - `node.remove()` - remove the `node`
  - Text strings are inserted "as text".

- Some "old school" methods:

  - `parent.appendChild(node)`
  - `parent.insertBefore(node, nextSibling)`
  - `parent.removeChild(node)`
  - `parent.replaceChild(newElem, node)`
  - All these methods return `node`.

- Given some HTML in `html`, `elem.insertAdjacentHTML(where, html)` inserts it depending on the value of `where`:

  - `"beforebegin"` - insert `html` right before `elem`
  - `"afterbegin"` - insert `html` into `elem`, at the beginning
  - `"beforeend"` - insert `html` into `elem`, at the end
  - `"afterend"` - insert `html` right after `elem`
  - Also there are similar methods, `elem.insertAdjacentText` and `elem.insertAdjacentElement`, that insert text strings and elements, but they are rarely used.

- To append HTML to the page before it has finishing loading:

  - `document.write(html)`
  - After the page is loaded such a call erases the document. Mostly seen in old scripts.

### Tasks

- `createTextNode` vs `innerHTML` vs `textContent`

  Both `elem.append(document.createTextNode(text))` and `elem.textContent = text` insert text into the `elem` while `elem.innerHTML = text` can recognize HTML element in the `text`.

- Clear the element

  ```
  function clear(elem) {
    while (elem.firstChild) {
      elem.firstChild.remove();
    }
  }
  ```

  or

  ```
  function clear(elem) {
    elem.innerHTML = '';
  }
  ```

- Why does "aaa" remain?

  `"aaa"`'s location inside the table was invalid so the browser moved it to the place before the table and that's why removal of the table didn't affect it.

- Create a list

  ```
  function createList(container) {
    let ul = document.createElement("ul");
    let text = prompt("Input content: ", "");
    while (text !== null){
      let li = document.createElement("li");
      li.textContent = text;
      ul.append(li);
      text = prompt("Input content: ", "");
    }
    container.append(ul);
  }
  ```

- Create a tree from the object

  ```
  function createTree(container, data) {
    if (Object.keys(data).length === 0) return;
    let ul = document.createElement("ul");
    for (let key of Object.keys(data)) {
      let li = document.createElement("li");
      li.textContent = String(key);
      createTree(li, data[key]);
      ul.append(li);
    }
    container.append(ul);
  }
  ```

- Show descendants in a tree

  ```
  function traverseTree(elem) {
    if (elem.children.length === 0) return 1;
    let count = 0;
    for (let child of elem.children) {
      count += traverseTree(child);
    }
    if (elem.nodeName === "LI") {
      elem.firstChild.data += " [" + String(count) + "]";
      count += 1;
    }
    return count;
  }
  ```

  or

  ```
  function traverseTree(elem) {
    let lis = document.getElementsByTagName("li");
    for (let li of lis) {
      let descendantsCount = li.getElementsByTagName("li").length;
      if (!descendantsCount) continue;
      li.firstChild.data += " [" + descendantsCount + "]";
    }
  }
  ```

- Create a calendar

  ```
  function createCalendar(elem, year, month) {
    let date = new Date(year, month - 1, 1, 0, 0, 0, 0);
    let dayOfFirstDate = date.getDay() - 1 >= 0 ? date.getDay() - 1 : 6;
    let start = false;
    let numDaysInMonth = new Date(year, month, 0, 0, 0, 0, 0).getDate();
    let days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    table.append(tbody);
    let day = 1;
    for (let i = 0; i < 6; i++) {
      if (day > numDaysInMonth) break;
      let tr = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let td = document.createElement("td");
        if (i === 0) {
          td.textContent = days[j];
          td.className = "th";
        } else if (i === 1 && j === dayOfFirstDate) {
          start = true;
        }
        if (start && day <= numDaysInMonth) {
          td.textContent = day;
          day++;
        }
        tr.append(td);
      }
      tbody.append(tr);
    }
    elem.append(table);
  }
  ```

  or

  ```
  function getDay(date) {
    let day = date.getDay();
    return day - 1 >= 0 ? day - 1 : 6;
  }

  function createCalendar(elem, year, month) {
    let mon = month - 1;
    let d = new Date(year, mon);
    let table =
      "<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>";
    for (let i = 0; i < getDay(d); i++) {
      table += "<td></td>";
    }
    while (d.getMonth() == mon) {
      table += "<td>" + d.getDate() + "</td>";
      if (getDay(d) % 7 == 6) {
        table += "</tr><tr>";
      }
      d.setDate(d.getDate() + 1);
    }
    if (getDay(d) != 0) {
      for (let i = getDay(d); i < 7; i++) {
        table += "<td></td>";
      }
    }
    table += "</tr></table>";
    elem.innerHTML = table;
  }
  ```

- Colored clock with setInterval

  ```
  function createClock(container) {
    let clock = document.createElement("div");
    clock.className = "clock";
    displayClasses = ["dh", "dm", "ds"];
    for (let i = 0; i < 3; i++) {
      let div = document.createElement("div");
      div.className = displayClasses[i];
      div.innerText = "00";
      clock.append(div);
      if (i < 2) {
        clock.append(document.createTextNode(":"));
      }
    }
    container.append(clock);
    return clock;
  }

  function startClock(clock) {
    let timerId = setInterval(
      (clock) => {
        let date = new Date();
        time = [date.getHours(), date.getMinutes(), date.getSeconds()];
        for (let i = 0; i < 3; i++) {
          let timeString = String(time[i]);
          if (time[i] < 10) {
            timeString = "0" + String(time[i]);
          }
          clock.children[i].innerText = timeString;
        }
      },
      100,
      clock
    );
    return timerId;
  }

  function stopClock(timerId) {
    console.log("stop");
    clearInterval(timerId);
    timerId = null;
  }
  ```

- Insert the HTML in the list

  ```
  let li2 = document.createElement("li");
  li2.firstChild.data = "2";
  document.getElementById("one").after(li2);
  let li3 = document.createElement("li");
  li3.firstChild.data = "3";
  document.getElementById("two").before(li3);
  ```

- Sort the table

  ```
  let sortedRows = Array.from(table.tBodies[0].rows);
  sortedRows..sort((rowA, rowB) => rowA.cells[0].innerHTML.localeCompare(rowB.cells[0].innerHTML));
  table.tBodies[0].append(...sortedRows);
  ```

### References

- [Modifying the document](https://javascript.info/modifying-document)
