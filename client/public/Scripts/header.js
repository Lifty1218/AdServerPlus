/* eslint-disable no-undef */

// EVENTLISTENER MENU BUTTON
$(".nav-btn").on("click", function () {
  $(".header-nav").toggleClass("display-block");
  $(".header-user").toggleClass("display-flex");
  $(".main-content").toggleClass("main-content--menu");
});

// EVENTLISTENER WHEN SCREEN SIZE GETS BIGGER THAN 750PX
var mediaQuery = window.matchMedia("(min-width: 750px)");
mediaQuery.addEventListener("change", function () {
  if (mediaQuery.matches) {
    $(".header-nav").removeClass("display-block");
    $(".header-user").removeClass("display-flex");
    $(".main-content").removeClass("main-content--menu");
  }
});

// EVENTLISTENER WHEN SCREEN SIZE GETS SMALLER THAN 750PX
var mediaQuery = window.matchMedia("(max-width: 750px)");
mediaQuery.addEventListener("change", function () {
  if (mediaQuery.matches) {
    $(".search").removeClass("display-flex");
    $(".search-container").removeClass("display-block");
    $(".search-btn-1").removeClass("display-none");
  }
});
