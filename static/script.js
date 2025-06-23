app()

function app() {
  setFooterCopyright()
  setNavigation()
  removeLastPageItemBorder()
}

function setFooterCopyright() {
    const copyright = document.querySelector(".footer-copyright")
    copyright.textContent = copyright.textContent + new Date().getFullYear()
}

function setNavigation() {
  const navigation = document.querySelector(".navigation")
  let preScrollY = 0
  window.onscroll = () => {
    let scrollY = this.scrollY
    scrollY > 200
      ? navigation.classList.add("compact-black-background")
      : navigation.classList.remove("compact-black-background")
    scrollY > 800 && scrollY > preScrollY
      ? navigation.classList.add("top-hidden")
      : navigation.classList.remove("top-hidden")
    preScrollY = scrollY
  }

  const body = document.querySelector("body")
  const expandButton = document.querySelector(".expand-button")
  const overlay = document.querySelector(".overlay")
  const links = document.querySelector(".links")

  expandButton.onclick = () => {
    body.classList.add("overflow-hidden")
    expandButton.classList.add("display-none")
    overlay.classList.add("left-zero")
    links.classList.add("left-zero")
  }

  const collapseButton = document.querySelector(".collapse-button")

  collapseButton.onclick = () => { 
    links.classList.remove("left-zero")
    overlay.classList.remove("left-zero")
    expandButton.classList.remove("display-none")
    body.classList.remove("overflow-hidden")
  }
}

function removeLastPageItemBorder() {
  const pageItems = document.querySelectorAll(".page-item")
  if (pageItems.length > 0) {
    const lastPageItem = pageItems[pageItems.length - 1]
    lastPageItem.style.border = "none"
  }
}