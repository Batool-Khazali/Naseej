const formWrapper = document.querySelector(".form-wrapper"),
    signupHeader = document.querySelector(".signup-form header"),
    loginHeader = document.querySelector(".login-form header");

loginHeader.addEventListener("click", () => {
    formWrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
    formWrapper.classList.remove("active");
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// register
async function Register() {
    // debugger
    event.preventDefault();
    const url = "https://localhost:7158/api/LoginRegister/register";
    const form = document.getElementById("SignUp");

    let userName = document.getElementById("SU-FName").value + " " + document.getElementById("SU-LName").value;
    let confirmPassword = document.getElementById("ConfirmPWD").value;
    let password = document.getElementById("Password").value;

    if (confirmPassword === password) {
        const formdata = new FormData(form);
        formdata.append("UserName", userName)

        let response = await fetch(url,
            {
                method: 'POST',
                body: formdata
            });

        if (response.ok) {
            event.preventDefault();
            document.getElementsByClassName("form-wrapper").item(0).classList.add("active");
        }
        else {
            Swal.fire({
                icon: "error",
                title: "حاول مجدداً",
                text: "تأكد من أن المعلومات المدخلة تطابق المطلوب",
            });
        }
    }
    else {
        Swal.fire({
            icon: "error",
            title: "حاول مجدداً",
            text: "كلمة السر المدخلة غير متطابقة",
        });
    }
}


// login
async function Login() {
    debugger
    event.preventDefault();

    const url = "https://localhost:7158/api/LoginRegister/login";
    let loginForm = document.getElementById("LogIn");
    const formData = new FormData(LogIn);

    let response = await fetch(url,
        {
            method: "POST",
            body: formData,
        }
    );

    if (response.ok) {
        let result = await response.json();

        localStorage.setItem('jwtToken', result.token);

        localStorage.setItem('userId', result.id);

        // if i arrived to login through a different page 
        //then redirect to said page after i'm logged in and remove it from local storage
        let previousPage = localStorage.getItem("previousPage");
        if (previousPage) {
            location.href = `${previousPage}.html`;
            localStorage.removeItem("previousPage");
        }
        else {
            location.href = "../index.html#home";
        }
    }
    else
    {
        Swal.fire({
            icon: "error",
            // title: "",
            text: "يبدو أن هنالك خطا في تسجيل الدخول. تأكد من المعلومات المدخلة و وجود حساب خاص بك؟",
            footer: '<a href="#">تواصل معنا في حال استمرار الخطأ</a>'
          });
    }

}


// logout function
async function logout() {
    event.preventDefault();

    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('GoogleUser');

    location.href = "../index.html";
}


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// regex
document.getElementById("ConfirmPWD").addEventListener("input", function () {
    // debugger
    let password = document.getElementById("Password").value;
    let confirmPassword = document.getElementById("ConfirmPWD").value;
    let CPWDerrorMessage = document.getElementById("Cpwd-error-message");

    if (password !== confirmPassword) {
        CPWDerrorMessage.style.display = "block";
    } else {
        CPWDerrorMessage.style.display = "none";
    }
});

document.querySelectorAll('input[name="Password"]').forEach(function (passwordInput) {
    passwordInput.addEventListener("input", function () {
        let PWD = passwordInput.value;
        let PWDregex = /^(?=.*[0-9]{2})(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9A-Za-z]).{8,50}$/;
        let PWDerrorMessage = passwordInput.parentElement.querySelector("#pwd-error-message");

        if (PWD === "") {
            PWDerrorMessage.style.display = "none";  
        } 
        else if (!PWDregex.test(PWD)) {
            PWDerrorMessage.style.display = "block"; 
        } 
        else {
            PWDerrorMessage.style.display = "none";
        }
    });
});

document.querySelectorAll('input[type="email"]').forEach(function (emailInput) {
    emailInput.addEventListener("input", function () {
        let email = emailInput.value;
        let emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let EmailerrorMessage = emailInput.parentElement.querySelector("#email-error-message");

        if (email === "") {
            EmailerrorMessage.style.display = "none";  
        } 
        else if (!emailregex.test(email)) {
            EmailerrorMessage.style.display = "block"; 
        } 
        else {
            EmailerrorMessage.style.display = "none";
        }
    });
});














