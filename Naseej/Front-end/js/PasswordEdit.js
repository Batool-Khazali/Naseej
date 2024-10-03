async function updatePWD() {

    debugger
    event.preventDefault();

    const oldPassword = document.getElementById("OldPWD").value;
    const newPassword = document.getElementById("NewPassword").value;
    const confirmNewPassword = document.getElementById("ConfirmNew").value;


    if (newPassword !== confirmNewPassword) {
        Swal.fire({
            icon: "error",
            title: "حاول مجدداً",
            text: "كلمة السر المدخلة غير متطابقة",
        });
        return;
    }

    const userId = localStorage.getItem("userId");

    const data = {
        id: userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
    };


        const response = await fetch('https://localhost:7158/api/Profile/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (response.ok) {
            location.href = "Profile.html";
        } else {
            Swal.fire({
                icon: "error",
                title: "حاول مجدداً",
                text: "تأكد من أن المعلومات المدخلة تطابق المطلوب",
            });
        }

}



//////////////////////// regex
document.getElementById("ConfirmNew").addEventListener("input", function () {
    // debugger
    let password = document.getElementById("NewPassword").value;
    let confirmPassword = document.getElementById("ConfirmNew").value;
    let CPWDerrorMessage = document.getElementById("confirmError");

    if (password !== confirmPassword) {
        CPWDerrorMessage.style.display = "block";
    } else {
        CPWDerrorMessage.style.display = "none";
    }
});

document.getElementById("NewPassword").addEventListener("input", function () {
    let PWD = this.value; 
    let PWDregex = /^(?=.*[0-9]{2})(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9A-Za-z]).{8,50}$/;
    let PWDerrorMessage = document.getElementById("pwdError");

    if (PWD === "") {
        PWDerrorMessage.style.display = "none";
    } else if (!PWDregex.test(PWD)) {
        PWDerrorMessage.style.display = "block"; 
    } else {
        PWDerrorMessage.style.display = "none"; 
    }
});









