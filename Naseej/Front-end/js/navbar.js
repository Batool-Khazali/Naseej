
document.addEventListener("DOMContentLoaded", function () {
    loginCheck();
});



//////////////////////////// darkmode toggle

// const toggleButton = document.getElementById('theme-toggle');

// toggleButton.addEventListener('change', () => {
//     // debugger
//     var body = document.getElementById("TheBody");
//     // Check if the toggle is checked and add or remove the class accordingly
//     if (toggleButton.checked) {
//         body.classList.add('dark-mode');
//     } else {
//         body.classList.remove('dark-mode');
//     }
// });

// const navToggle = document.querySelector('.nav__open');
// const nav = document.querySelector('.nav');

// navToggle.addEventListener('click', () => {
//   nav.classList.toggle('nav--active');
// });


//////////////////////////// login check

function loginCheck() {
    // debugger
    let IsLoggedIn = localStorage.getItem('jwtToken');
    let logSection = document.getElementById("IsLoggedIn");

    if (IsLoggedIn) {
        logSection.innerHTML += `<a href="Profile.html"><i class="fa-solid fa-user" style="color: #504a40;"></i></a>`
        document.getElementById("logout").style.display = "block";
    }
    else {
        logSection.innerHTML = `<a href="Login.html" class="nav__link">تسجيل الدخول | إنشاء حساب</a>`
        document.getElementById("logout").style.display = "none";

    }
}


///////////////////////////////////////////////// logout

// logout function
document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('GoogleUser');

    location.href = "../index.html";
})




