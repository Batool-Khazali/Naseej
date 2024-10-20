
const userId = localStorage.getItem('userId');
// console.log(userId);

//////////////////////// fill category options

document.addEventListener('DOMContentLoaded', function () {
    fillCategory();
});

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
    // debugger
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
        // alert("Product added successfully!");
        window.location.href = "store.html";
    } else {
        // alert("Failed to add product. Please try again.");
        Swal.fire({
            icon: "error",
            title: "يبدو أن هنالك خطأ ما",
            text: "تأكد من أن المعلومات المدخلة تطابق المطلوب",
        });
    }
}























