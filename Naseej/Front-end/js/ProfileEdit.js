
document.addEventListener('DOMContentLoaded', function () {
    fill();
});

////////////////////////// fill input with user data from DB
async function fill() {
    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/Profile/getUserInfo/${userId}`;
    const response = await fetch(url);
    let data = await response.json();

    document.getElementById('userEmail').value = data.email;
    document.getElementById('userPhone').value = data.phone;
    document.getElementById('userFullName').value = data.name;
    document.getElementById('userAge').value = data.birthDay;
    document.getElementById('imagePreview').src += data.image;
}





/////////////////////////// edit profile
async function updateProfile(event) {
    event.preventDefault();
    debugger
    const UserId = localStorage.getItem('userId');

    const url = `https://localhost:7158/api/Profile/updateUserProfile/${UserId}`;
    const form = document.getElementById("UserInfoEdit");

    const formData = new FormData(form);

    const userAgeInput = document.getElementById('userAge').value;
    if (userAgeInput) {
        const birthDate = new Date(userAgeInput);
        if (!isNaN(birthDate)) {
            formData.append('BirthDay', birthDate.toISOString().split('T')[0]); // YYYY-MM-DD
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
            return;
        }
    } else {
        Swal.fire({
            icon: "error",
            text: "الرجاء ادخال تاريخ الميلاد",
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
        return;
    }

    const jordanianPhoneRegex = /^07[7-9]\d{7}$/;
    const phoneNumber = document.getElementById('userPhone').value.trim();
    const errorMessage = document.getElementById('phoneErrorMessage');

    if (!jordanianPhoneRegex.test(phoneNumber)) {
        errorMessage.textContent = "الرجاء ادخال رقم هاتف تجوال أردني";
        errorMessage.style.display = "block";
        Swal.fire({
            icon: "error",
            text: "الرجاء ادخال رقم هاتف تجوال أردني",
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
        return;
    }

    let response = await fetch(url,
        {
            method: 'PUT',
            body: formData
        }
    )

    if (response.ok) {
        window.location.href = "Profile.html";
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



////////////////////////////////////// image preview
document.getElementById('userImage').addEventListener('change', function (event) {
    const file = event.target.files[0]; 
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImage = document.getElementById('imagePreview');
            previewImage.src = e.target.result; 
        };
        reader.readAsDataURL(file);
    }
});


//////////////////////////////////////////// phone regex
document.getElementById('userPhone').addEventListener('input', function (event) {
    event.preventDefault();

    const jordanianPhoneRegex = /^07[7-9]\d{7}$/;
    const phoneNumber = document.getElementById('userPhone').value.trim();
    const errorMessage = document.getElementById('phoneErrorMessage');

    if (!jordanianPhoneRegex.test(phoneNumber)) {
        errorMessage.textContent = "الرجاء ادخال رقم هاتف تجوال أردني";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
});


////////////////////// set min age to 18
const birthdateInput = document.getElementById('userAge');
const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  .toISOString()
  .split('T')[0];
birthdateInput.setAttribute('max', maxDate);









