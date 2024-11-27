
const userId = localStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', () => {

    if (!userId){
        Swal.fire({
            title: "الرجاء تسجيل الدخول ",
            icon: "error",
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
    
          setTimeout(function() {
            location.href = "Login.html"; 
          }, 3000);
    }

    getUserInfo();

});


///////////////////////// get location

async function getUserInfo() {

    const url = `https://localhost:7158/api/CartAndOrder/getUserInfo/${userId}`;

    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("userCity").value = data.city;
    document.getElementById("userGovernate").value = data.governate;
    document.getElementById("userAddress").value = data.address;
}



///////////////////////////////// update locatiom

async function updateLocation(event)
{
    event.preventDefault();
    // debugger
    const url = `https://localhost:7158/api/Profile/userLocation/${userId}`;

    const form = document.getElementById('UserLocation');
    const formData = new FormData(form);

    const response = await fetch(url, {
        method: 'PUT',
        body: formData,
    });
    
    if (response.ok) {

        Swal.fire({
            title: "تم تعديل الموقع بنجاح",
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

          setTimeout(function() {
            location.href = "Profile.html";
          }, 3000);

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











