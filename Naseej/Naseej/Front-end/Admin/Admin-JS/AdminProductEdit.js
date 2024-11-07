
const productId = localStorage.getItem('AdminProID');


document.addEventListener('DOMContentLoaded', () => {

    getProductInfo()

});

///////////////// get product Information

async function getProductInfo() {

    // debugger
    const url = `https://localhost:7158/api/AdminProducts/getProductDetails/${productId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {

        await populateCategories(data.categoryId);

        document.getElementById('image1Preview').src = `../../images/${data.productImage}`;
        document.getElementById('image2Preview').src = `../../images/${data.productImage2}`;
        document.getElementById('image3Preview').src = `../../images/${data.productImage3}`;
        document.getElementById('image4Preview').src = `../../images/${data.productImage4}`;

        const colors = data.color.split(',');
        colors.forEach(color => {
            const checkbox = document.querySelector(`input[class="form-check-input color-checkbox"][value="${color.trim()}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        document.getElementById('productName').value = data.productName;
        document.getElementById('productType').value = data.productType;
        document.getElementById('price').value = data.price;
        document.getElementById('stock').value = data.stock;

        document.getElementById('productDescription').value = data.productDescription;
        document.getElementById('categoryName').value = data.categoryId;
        document.getElementById('businessName').value = data.businessName;
        document.getElementById('address').value = `${data.city} - ${data.adress}`;


    }
}


/////////////////////////////// get categories

async function populateCategories(selectedCategoryId) {
    const url = 'https://localhost:7158/api/AdminProducts/getMainAndSubCategories';
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        const categorySelect = document.getElementById('categoryName');

        const combinedCategories = data.map(item => ({
            id: item.id,
            label: `${item.name} - ${item.subCategory}`
        }));

        // Populate the dropdown with the combined categories
        categorySelect.innerHTML = ''; // Clear existing options
        combinedCategories.forEach(category => {
            categorySelect.innerHTML += `
                <option value="${category.id}" ${category.id == selectedCategoryId ? 'selected' : ''}>
                    ${category.label}
                </option>
            `;
        });
    }
}



////////////////////////////////// edit 


async function editPro(event) {
    event.preventDefault();
debugger
    const url = `https://localhost:7158/api/AdminProducts/editProdut/${productId}`;

    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);

    const checkboxes = document.querySelectorAll('.color-checkbox');
    const selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const colorString = selectedColors.join(',');
    formData.append("color", colorString);

    formData.append("categoryId", document.getElementById("categoryName").value);

    // for (const [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    // }


        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            Swal.fire({
                title: "Success",
                text: "Product was edited successfully!",
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
            // location.href = "Products.html";  
        } else {
            const errorText = await response.text();
            Swal.fire({
                title: "Error",
                text: "Failed to edit product. Please try again.",
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
        }

}






