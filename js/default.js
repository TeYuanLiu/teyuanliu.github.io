app();

function app() {
  setNavbar();
  setFooter();
}

function setFooter() {
  const copyright = document.createElement("p");
  copyright.classList.add("copyright");
  copyright.textContent =
    "Copyright \u00A9 Te-Yuan Liu " + new Date().getFullYear();

  const footer = document.querySelector(".footer");
  footer.append(copyright);
}

function setNavbar() {
  const body = document.querySelector("body");
  const navbar = document.querySelector(".navbar");
  const menu = document.querySelector(".menu-list");
  const menuBtn = document.querySelector(".menu-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const overlay = document.querySelector(".overlay");
  menuBtn.onclick = () => {
    menu.classList.add("left-zero");
    menuBtn.classList.add("display-none");
    body.classList.add("noScroll");
    overlay.classList.add("left-zero");
  };
  cancelBtn.onclick = () => {
    menu.classList.remove("left-zero");
    menuBtn.classList.remove("display-none");
    body.classList.remove("noScroll");
    overlay.classList.remove("left-zero");
  };
  let preScrollY = 0;
  window.onscroll = () => {
    let scrollY = this.scrollY;
    scrollY > 200
      ? navbar.classList.add("sticky")
      : navbar.classList.remove("sticky");
    scrollY > 800 && scrollY > preScrollY
      ? navbar.classList.add("top-hidden")
      : navbar.classList.remove("top-hidden");
    preScrollY = scrollY;
  };
}
