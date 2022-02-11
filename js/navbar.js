const navResponsive = () => {
  const body = document.querySelector("body");
  const navbar = document.querySelector(".navbar");
  const menu = document.querySelector(".menu-list");
  const menuBtn = document.querySelector(".menu-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const overlay = document.querySelector(".overlay");
  menuBtn.onclick = () => {
    menu.classList.add("active");
    menuBtn.classList.add("display-none");
    body.classList.add("noScroll");
    overlay.classList.remove("hidden");
  };
  cancelBtn.onclick = () => {
    menu.classList.remove("active");
    menuBtn.classList.remove("display-none");
    body.classList.remove("noScroll");
    overlay.classList.add("hidden");
  };
  let preScrollY = 0;
  window.onscroll = () => {
    let scrollY = this.scrollY;
    scrollY > 200
      ? navbar.classList.add("sticky")
      : navbar.classList.remove("sticky");
    scrollY > 800 && scrollY > preScrollY
      ? navbar.classList.add("hidden")
      : navbar.classList.remove("hidden");
    preScrollY = scrollY;
  };
};

const app = () => {
  navResponsive();
};

app();
