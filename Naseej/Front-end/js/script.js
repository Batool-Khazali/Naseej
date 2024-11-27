
//////////// hp navbar scroll effect
const navbar = document.querySelector(".navbar");
function handleNavbarScroll() {
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}



document.addEventListener("DOMContentLoaded", function () {

  const navToggle = document.getElementById("nav");
  const navMenu = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // mobile toggler
  navToggle.addEventListener("change", function () {
    if (navToggle.checked) {
      navMenu.classList.add("nav--active");
    } else {
      navMenu.classList.remove("nav--active");
    }
  });

  // Close the nav menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navToggle.checked = false;
      navMenu.classList.remove("nav--active");
    });
  });

  // scroll navbar
  handleNavbarScroll()
  window.addEventListener("scroll", handleNavbarScroll);
});




//////////////////// dark mode
const darkModeToggle = document.getElementById('darkModeToggle');

  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.checked = true;
  }

  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    darkModeToggle.checked = false;
  }

  window.onload = () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  };

  darkModeToggle.addEventListener('change', () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode !== 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });