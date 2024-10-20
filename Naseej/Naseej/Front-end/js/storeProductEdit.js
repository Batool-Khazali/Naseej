





//////////////////////// fill category options
const userId = localStorage.getItem('userId');

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


///////////////////////////// fill data
const ProId = localStorage.getItem('stoProId');

async function getDetails(proId) {
    // debugger
    const ProUrl = `https://localhost:7158/api/ProductsDetails/DetailByProId/${proId}`;

    const response = await fetch(ProUrl);
    if (response.status === 404) {
        const container = document.getElementById("ContentContainer");
        container.innerHTML = `<h1>لا يوجد منتج مطابق</h1>`;
        return;
    }

    let ProData = await response.json();

    //////name
    const name = document.getElementById("productName");
    name.value = ProData.name;

    ////////////////// price
    const price = document.getElementById("ProductPrice");
    price.value = ProData.price;

    ////////////////// description
    const description = document.getElementById("productDescription");
    description.value = ProData.description;

    ////////////////// colors 
    const availableColors = ["red", "blue", "green", "yellow", "white", "black", "gray", "pink", "purple", "orange"];
    ProData.color.forEach(element => {
        if (availableColors.includes(element)) {
            const colorCheckbox = document.getElementById(element);
            if (colorCheckbox) {
                colorCheckbox.checked = true;
            }
        }
    });

    ////////////////// Product Category
    const categoryId = ProData.c.categoryId;
    const category = document.getElementById("productCategory");
    category.value = categoryId;

    //////////////// stock
    const stock = document.getElementById("ProStock");
    stock.value = ProData.stock;

    //////////////// sale
    const sale = document.getElementById("productSale");
    sale.value = ProData.salePercentage;
}

getDetails(ProId);



/////////////////////////////////// edit product


async function editProduct() {
    // event.preventDefault();
    debugger

    const url =`https://localhost:7158/api/Store/editProdut/${userId}/${ProId}`

    const form = document.getElementById('editStoreProduct');
    const formData = new FormData(form);

    const checkboxes = document.querySelectorAll('.color-checkbox');
    const selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const colorString = selectedColors.join(',');
    formData.append("color", colorString);

    formData.append("categoryId", document.getElementById("productCategory").value);

    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await fetch(url, {
        method: 'PUT',
        body: formData,
    });


    if (response.ok) {
        location.href = "storeProducts.html"
    } else {
        const errorText = await response.text();
        alert(`Failed to update product: ${errorText}`);
    }

}









