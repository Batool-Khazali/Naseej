
document.addEventListener("DOMContentLoaded", function () {
    loginCheck();
});


//////////////////////////// login check

function loginCheck() {
    // debugger
    let IsLoggedIn = localStorage.getItem('jwtToken');
    let logSection = document.getElementById("IsLoggedIn");

    if (IsLoggedIn) {
        logSection.innerHTML += `<a href="html/Profile.html"><i class="fa-solid fa-user" style="color: #504a40;"></i></a>`
        document.getElementById("logout").style.display = "block";
    }
    else {
        logSection.innerHTML = `<a href="html/Login.html" class="nav__link">تسجيل الدخول | إنشاء حساب</a>`
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
    localStorage.removeItem('isAdmin');

    location.href = "index.html";
})




