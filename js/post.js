app();

function app() {
  decorateLabeledCodeblock();
}

function addClassLabeled(elem) {
  elem.classList.add("labeled");
}

function copyText() {
  navigator.clipboard.writeText(this.dataset.text);
}

function addCopyTextButton(elem) {
  let button = document.createElement("button");

  button.classList.add("copy-text");
  button.textContent = "Copy Text";
  button.dataset.text =
    elem.lastElementChild.lastElementChild.lastElementChild.textContent;
  button.onclick = copyText;

  elem.after(button);
}

function decorateLabeledCodeblock() {
  const labels = document.querySelectorAll(".codeblock-label");
  for (const label of labels) {
    const codeBlock = label.nextElementSibling;
    const pre = codeBlock.lastElementChild.lastElementChild;
    addClassLabeled(pre);
    addClassLabeled(codeBlock);
    addCopyTextButton(codeBlock);
  }
}
