
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

    const url = "https://localhost:7158/api/AdminCategories/getAllCategories";

    const response = await fetch(url);
    let data = await response.json();

    const table = document.getElementById("CatrgoryTable");
    table.innerHTML = "";

    let tableIndex = 1;

    data.forEach(element => {

        table.innerHTML += `
        <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.image}" alt="${element.name}'s logo" style="width:5em; height: 5em; object-fit: cover" class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.name}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.subCategory}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.description}</p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.usage}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.care}</td>
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminCategoryEdit.html" onclick="catID(${element.id})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteCategory(${element.id})">Remove</a>
                                </div>
                                </td>
                            </tr>        
        `;

        tableIndex++;

    });


}

////////////////////////////////

function catID(id) {
    localStorage.setItem('AdminCatID', id);
    window.location.href = "AdminCategoryEdit.html";
}


///////////////////////////////////////////////////// delete category

async function DeleteCategory(id) {

    const url = `https://localhost:7158/api/AdminCategories/deleteCategory/${id}`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        text: "Products and Items in both Carts and Orders will be deleted!",
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
                        text: "Your file has been deleted.",
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



//////////////////////////////////////////////// filtering

document.getElementById("categorySearch").addEventListener("input", async function () {
    debugger
    const text = this.value.trim();

    if (!text) {
        fillTable();
        return;
    }

    const url = `https://localhost:7158/api/AdminCategories/searchByName/${text}`;
    const response = await fetch(url);
    
    if (response.ok) {
        const data = await response.json();

        const table = document.getElementById("CatrgoryTable");
        table.innerHTML = "";

        let tableIndex = 1;
        
        data.forEach(element => {
            table.innerHTML += `
        <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.image}" alt="${element.name}'s logo" style="width:5em; height: 5em; object-fit: cover" class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.name}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.subCategory}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.description}</p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.usage}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.care}</td>
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminCategoryEdit.html" onclick="catID(${element.id})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteCategory(${element.id})">Remove</a>
                                </div>
                                </td>
                            </tr>        
        `;
            tableIndex++;
        });
    } else {
        
        document.getElementById("CatrgoryTable").innerHTML = "<h3>No category was found that matches the search.</h3>";
    }

});














