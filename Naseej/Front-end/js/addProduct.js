
const userId = localStorage.getItem('userId');
// console.log(userId);


//////////////////////// fill category options

document.addEventListener('DOMContentLoaded', function () {

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


    fillCategory();

    ////////////////////////// display images
    // Map input IDs to their corresponding preview image IDs
    const imagePreviewMap = {
        productImage: 'image1Preview',
        productImage2: 'image2Preview',
        productImage3: 'image3Preview',
        productImage4: 'image4Preview',
    };

    // Add change event to file inputs
    Object.keys(imagePreviewMap).forEach(inputId => {
        const fileInput = document.getElementById(inputId);
        const previewImage = document.getElementById(imagePreviewMap[inputId]);

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });
});

//////////////////////////////////////////////////

async function fillCategory() {
    const url = `https://localhost:7158/api/Categories/getCatAnSubCatByStore/${userId}`;
    const response = await fetch(url);

    let data = await response.json();

    const category = document.getElementById("productCategory");

    data.forEach(item => {

        category.innerHTML += `
        <option value="${item.id}">${item.subCategory}</option>
        `
    });
}

////////////////////////////// add product

async function addProduct(event) {
    event.preventDefault();
    debugger
    const url = `https://localhost:7158/api/Store/addProduct/${userId}`;

    const form = document.getElementById("addStoreProduct");
    const formData = new FormData(form);

    const checkboxes = document.querySelectorAll('.color-checkbox');
    const selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const colorString = selectedColors.join(',');
    formData.append("color", colorString);

    formData.append("categoryId", document.getElementById("productCategory").value);

    const response = await fetch(url,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (response.ok) {
        Swal.fire({
            title: "تم إضافة المنتج بنجاح",
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
            location.href = "storeProducts.html";
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























