const menuBtn = document.querySelector(".main-nav__toggle");
const navMenu = document.querySelector(".main-nav");
menuBtn.addEventListener("click", function() {
  navMenu.classList.toggle("main-nav--closed");
});

if(navMenu.classList.contains("no-js")){
  navMenu.classList.remove("no-js");
}
