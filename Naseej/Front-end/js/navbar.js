const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('change', () => {
    // debugger
    var body = document.getElementById("TheBody");
    // Check if the toggle is checked and add or remove the class accordingly
    if (toggleButton.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
});

const navToggle = document.querySelector('.nav__open');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('nav--active');
});











