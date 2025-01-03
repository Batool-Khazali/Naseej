
/////////////////////////// switch between sections
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
async function Register(event) {
    // debugger
    event.preventDefault();
    const url = "https://localhost:7158/api/LoginRegister/register";
    const form = document.getElementById("SignUp");

    let userName = document.getElementById("SU-FName").value + " " + document.getElementById("SU-LName").value;
    let confirmPassword = document.getElementById("ConfirmPWD").value;
    let password = document.getElementById("Password").value;

    const emailErrorMessage = document.getElementById("email-error-message3");
    emailErrorMessage.style.display = "none";

    if (confirmPassword === password) {
        const formdata = new FormData(form);
        formdata.append("UserName", userName)

        let response = await fetch(url,
            {
                method: 'POST',
                body: formdata
            });

        if (response.ok) {
            document.getElementsByClassName("form-wrapper").item(0).classList.add("active");
        }
        else {
            // debugger
            const errorData = await response.text();
            if (errorData === "The user already exists.") {

                emailErrorMessage.style.display = "block";
                emailErrorMessage.textContent = "هذا البريد الإلكتروني مسجل مسبقاً";
            } else {

                Swal.fire({
                    icon: "error",
                    title: "يبدو أن هنالك خطأ ما",
                    footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>',
                    showClass: {
                        popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                        popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    }
                });
            }
        }
    }
    else {
        Swal.fire({
            icon: "error",
            text: "كلمة السر المدخلة غير متطابقة",
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
        });
    }
}


// login
async function Login(event) {
    // debugger
    event.preventDefault();

    const url = "https://localhost:7158/api/LoginRegister/login";
    let loginForm = document.getElementById("LogIn");
    const formData = new FormData(loginForm);

    let response = await fetch(url,
        {
            method: "POST",
            body: formData,
        }
    );

    if (response.ok) {
        debugger
        let result = await response.json();

        localStorage.setItem('jwtToken', result.token);

        localStorage.setItem('userId', result.id);

        localStorage.setItem('isAdmin', result.isAdmin);


        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith("item")) {
                moveCartItems();
                break;
            }
        }

        Swal.fire({
            title: "أهلا بعودتك",
            icon: "success",
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
        });

        // debugger
        // if i arrived to login through a different page 
        //then redirect to said page after i'm logged in and remove it from local storage
        setTimeout(function () {

            if (result.isAdmin) {
                location.href = "../Admin/index.html";
            } else {

                let previousPage = localStorage.getItem("previousPage");
                if (previousPage) {
                    location.href = `${previousPage}.html`;
                    localStorage.removeItem("previousPage");
                } else {
                    location.href = "../index.html";
                }
            }

        }, 3000);

    }
    else {
        Swal.fire({
            icon: "error",
            title: "يبدو أن هنالك خطأ ما",
            text: "يبدو أن هنالك خطا في تسجيل الدخول. تأكد من المعلومات المدخلة و وجود حساب خاص بك؟",
            footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>',
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
        });

    }

}



/// move cart items from local storage to database
async function moveCartItems() {
    debugger
    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/CartAndOrder/moveLsToDb/${userId}`;

    let cartItems = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("item")) {
            cartItems.push(JSON.parse(localStorage.getItem(key)));
        }
    }

    const respone = await fetch(url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItems)
        }
    );

    // console.log(respone)

    if (respone.ok) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            let key = localStorage.key(i);
            if (key.startsWith("item")) {
                localStorage.removeItem(key);
            }
        }
    }
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
        let EmailerrorMessage2 = emailInput.parentElement.querySelector("#email-error-message2");

        if (email === "") {
            EmailerrorMessage.style.display = "none";
        }
        else if (!emailregex.test(email)) {
            EmailerrorMessage.style.display = "block";
        }
        else if (email.endsWith("@naseej.com")) {
            EmailerrorMessage2.style.display = "block";
        }
        else {
            EmailerrorMessage.style.display = "none";
            EmailerrorMessage2.style.display = "none";
        }
    });
});














