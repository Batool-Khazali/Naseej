

async function sendMessage(event) {
    event.preventDefault();

    if (document.getElementById("email").value == null || document.getElementById("email").value.trim() == "") {
        Swal.fire({
            icon: "error",
            // title: "",
            text: "الرجاء ادخال البريد الالكتروني الخاص بك",
        });
        return;
    }

    const url = "https://localhost:7158/api/ContactUs/sendContactmessage";

    const form = document.getElementById("contactForm");

    const formData = new FormData(form);

    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "لقد تم إرسال الرسالة بنجاح",
            showConfirmButton: false,
            timer: 1000,
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
    else {
        Swal.fire({
            icon: "error",
            // title: "",
            text: "يبدو أن هنالك خطا في الأرسال",
            footer: '<a href="#">تواصل معنا في حال استمرار الخطأ</a>'
          });
    }
}