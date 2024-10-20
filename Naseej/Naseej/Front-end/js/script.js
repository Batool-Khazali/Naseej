

const navbar = document.querySelector(".navbar");
function handleNavbarScroll() {
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the checkbox (burger menu), the navigation menu, and all nav links
  const navToggle = document.getElementById("nav");
  const navMenu = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // Toggle the active class to show or hide the nav menu on mobile
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
      navToggle.checked = false; // Uncheck the checkbox
      navMenu.classList.remove("nav--active"); // Remove the active class
    });
  });

  // Add background color change on scroll for navbar
  handleNavbarScroll()
  window.addEventListener("scroll", handleNavbarScroll);
});


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