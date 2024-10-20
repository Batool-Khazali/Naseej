


document.addEventListener('DOMContentLoaded', function () {
    getStores();

});

///////////////// get data

async function getStores(index) {
    const table = document.getElementById("StoreTable");
    table.innerHTML = "";

    const url = "https://localhost:7158/api/AdminStores/getallStores"
    const response = await fetch(url);
    const data = await response.json();

    let tableIndex = 1;

    data.forEach(element => {
        table.innerHTML += `
                            <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.logo}" alt="..." class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.so.name}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.name}</p>
                                <small class="mb-0 text-muted">${element.businessType} - ${element.specialty}</small>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><a  class="text-muted">0${element.phone}</a></p>
                                <small class="mb-0 text-muted">${element.city} - ${element.governate}</small>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.status}</td>
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminStoreDetails.html" onclick="storeID(${element.id})">Details</a>
                                    <a class="dropdown-item" href="AdminStoreEdit.html" onclick="storeID(${element.id})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteStore(${element.id})">Remove</a>
                                </div>
                                </td>
                            </tr>
         `;

        index++;
    });
}


//////////////////////////////// Delete Store

async function DeleteStore(id) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            //////////// Delete
            async function Delete() {
                const url = `https://localhost:7158/api/AdminStores/DeleteStore/${id}`
                const response = await fetch(url, {
                    method: 'DELETE'
                });
            }
            Delete();

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

        }
    });


}

/////////////////////////// store id
function storeID(id) {
    localStorage.setItem("storeId", id);
}


////////////////////////////// filter status

document.getElementById("inlineFormCustomSelectPref").addEventListener("change", async function () {
    debugger
    let status = this.value;

    const url = `https://localhost:7158/api/AdminStores/getStoresByStatus/${status}`;
    const response = await fetch(url);

    if (response.ok) {

        let statusData = await response.json();

        const table = document.getElementById("StoreTable");
        table.innerHTML = "";

        let tableIndex = 1;

        statusData.forEach(element => {

            table.innerHTML += `
                            <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <div class="avatar avatar-md">
                                    <img src="../../images/${element.logo}" alt="..." class="avatar-img rounded-circle">
                                </div>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><strong>${element.so.name}</strong></p>
                                </td>
                                <td>
                                <p class="mb-0 text-muted">${element.name}</p>
                                <small class="mb-0 text-muted">${element.businessType} - ${element.specialty}</small>
                                </td>
                                <td>
                                <p class="mb-0 text-muted"><a  class="text-muted">0${element.phone}</a></p>
                                <small class="mb-0 text-muted">${element.city} - ${element.governate}</small>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.status}</td>
                                <td><button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="text-muted sr-only">Action</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="AdminStoreDetails.html" onclick="storeID(${element.id})">Details</a>
                                    <a class="dropdown-item" href="AdminStoreEdit.html" onclick="storeID(${element.id})">Edit</a>
                                    <a class="dropdown-item" onclick="DeleteStore(${element.id})">Remove</a>
                                </div>
                                </td>
                            </tr>
                            `;
            tableIndex++;
        })

    }
    else {

        const table = document.getElementById("StoreTable");
        table.innerHTML = "";
        table.innerHTML = "<h3>no store was found that matches the status choosen</h3>"

    }
})







