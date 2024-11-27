
const admin = localStorage.getItem('isAdmin');


document.addEventListener('DOMContentLoaded', () => {
    if (!admin) {
        Swal.fire({
          title: "Error",
          text: "You are not authorized to access this page.",
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
        
    
        setTimeout(function () {
          location.href = "../index.html";
        }, 3000);
        
      }

    fillTable()

})



////////////////////////////////// fill table

async function fillTable() {

    const url = "https://localhost:7158/api/AdminProducts/getAllProducts";

    const response = await fetch(url);
    let data = await response.json();

    const table = document.getElementById("ProductsTable");
    table.innerHTML = "";

    let tableIndex = 1;

    data.forEach(element => {

        table.innerHTML += `
        <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.productImage}" alt="${element.productName}'s image" style="width:5em; height: 5em; object-fit: cover" class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.productName}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.categoryName} - ${element.subCategory}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.price}</p>
                                </td>
                                <td>
                                    <div class="color-container">
                                        ${element.color.split(',').map(color => `
                                            <span class="color-circle" style="background-color: ${color.trim()};"></span>
                                        `).join('')}
                                    </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.stock}</p>
                                </td>
                                
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminProductDetails.html" onclick="proId(${element.productId})">Details</a>
                                    <a class="dropdown-item" href="AdminProductEdit.html" onclick="proId(${element.productId})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteProduct(${element.productId})">Remove</a>
                                </div>
                                </td>
                            </tr>        
        `;
        tableIndex++;

    });


}

////////////////////////////////

function proId(id) {
    localStorage.setItem('AdminProID', id);
}


///////////////////// delete product

async function DeleteProduct(id) {

    const url = `https://localhost:7158/api/AdminProducts/DeleteProduct/${id}`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        text: "Products in both Carts and Orders will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            async function deleteCat() {
                const response = await fetch(url, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fillTable()
                    Swal.fire({
                        title: "Deleted!",
                        text: "the product has been deleted.",
                        icon: "success"
                    });
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: "an error occurred",
                        icon: "error"
                    });
                }

            }

            deleteCat();
        }
    });

}

///////////////////////////////////// fill category select

async function fillCategorySelect() {

    const url = "https://localhost:7158/api/Products/getCategoriesAndSubCategories";

    const response = await fetch(url);

    if (response.ok) {
        let data = await response.json();

        const select = document.getElementById("categorySelect");

        data.subCategories.forEach(element => {

            select.innerHTML += `
                <option value="${element.name}-${element.subCategory}">${element.name} - ${element.subCategory}</option>
                `;

        });
    }
}
fillCategorySelect();

//////////////////////////////////////////////////////////filter

let productsFilters = {
    productName: "",
    categoryName: "",
    subCategoryName: "",
    color: [],
    businessName: "",
    businessGovernate: "",
    minPrice: null,
    maxPrice: null,
    page: 1,
    take: 25
};

function addFilters() {
    debugger
    // name
    let searchText = document.getElementById("nameSearch").value;
    productsFilters.productName = searchText || "";


    // colors
    let selectedColor = document.getElementById('colorSelect').value;
    productsFilters.color = selectedColor || "";

    // category and sub-category names
    let categoryName = document.getElementById('categorySelect').value.split('-')[0];
    let subCategoryName = document.getElementById('categorySelect').value.split('-')[1];
    productsFilters.categoryName = categoryName;
    productsFilters.subCategoryName = subCategoryName;

}

async function filterProducts() {
debugger
    addFilters();

    const params = new URLSearchParams();

    Object.keys(productsFilters).forEach(key => {
        const value = productsFilters[key];
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else if (value || value === 0) {
            params.set(key, value);
        }
    });

    const url = `https://localhost:7158/api/AdminProducts/productsFilter?${params}`;
    const response = await fetch(url);

    if (response.ok) {
        let data = await response.json();
        const productList = data.list;
        console.log(productList)

        const table = document.getElementById("ProductsTable");
        table.innerHTML = "";

        if (data.list.length == 0) {

            table.innerHTML = "<h3>no product was found that matches the search</h3>"
            return;
        }

        let tableIndex = 1;

        data.list.forEach(element => {
            table.innerHTML += `
        <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.productImage}" alt="${element.productName}'s image" style="width:5em; height: 5em; object-fit: cover" class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.productName}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.categoryName} - ${element.subCategory}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.price}</p>
                                </td>
                                <td>
                                    <div class="color-container">
                                        ${element.color.split(',').map(color => `
                                            <span class="color-circle" style="background-color: ${color.trim()};"></span>
                                        `).join('')}
                                    </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.stock}</p>
                                </td>
                                
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminProductDetails.html" onclick="proId(${element.productId})">Details</a>
                                    <a class="dropdown-item" href="AdminProductEdit.html" onclick="proId(${element.productId})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteProduct(${element.productId})">Remove</a>
                                </div>
                                </td>
                            </tr>        
        `;
            tableIndex++;
        });

    }

}


