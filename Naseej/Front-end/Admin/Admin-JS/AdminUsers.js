
const admin = localStorage.getItem('isAdmin');


document.addEventListener('DOMContentLoaded', function () {
    
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
    getAllUsers();

});


//////////////////////////////////////////////////////////////// get all users

async function getAllUsers() {

    const url = "https://localhost:7158/api/AdminUsers/getAllUsers"

    const response = await fetch(url)
    let data = await response.json();

    const container = document.getElementById("UserTable");
    container.innerHTML = "";

    let tableIndex = 1;

    data.forEach(element => {
        container.innerHTML += `
                            <tr>
                                <td>${tableIndex}</td>
                                <td>
                                    <div class="avatar avatar-md">
                                        <img src="../../images/${element.image}" alt="${element.name}'s image" class="avatar-img rounded-circle" style="width:5em; height: 5em; object-fit: cover">
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted"><strong>${element.name}</strong></p>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted">${element.email}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.address} - ${element.city}</td>
                                <td>
                                    <button class="btn btn-primary" href="AdminUserDetails.html" onclick="UserID('${element.id}')">Details</button>
                                </td>
                            </tr>
         `;

        tableIndex++;

    });

}

//////////////////////////// store user id

function UserID(id) {
    debugger
    localStorage.setItem("AdminUserID", id);
    window.location.href = "AdminUserDetails.html";
}


////////////////////////////// filter by name/email

document.getElementById("userNameEmailSearch").addEventListener("input", async function () {
    const text = this.value.trim();

    if (!text) {
        getAllUsers();
        return;
    }

    const url = `https://localhost:7158/api/AdminUsers/getusersByNameOrEmail/${text}`;
    const response = await fetch(url);

    if (response.ok) {
        const users = await response.json();
        const table = document.getElementById("UserTable");
        table.innerHTML = "";

        let tableIndex = 1;
        
        users.forEach(user => {
            table.innerHTML += `
                    <tr>
                        <td>${tableIndex}</td>
                        <td>
                            <div class="avatar avatar-md">
                                <img src="../../images/${user.image}" alt="${user.name}'s image" class="avatar-img rounded-circle" style="width:5em; height: 5em; object-fit: cover">
                            </div>
                        </td>
                        <td>
                            <p class="mb-0 text-muted"><strong>${user.name}</strong></p>
                        </td>
                        <td>
                            <p class="mb-0 text-muted">${user.email}</p>
                        </td>
                        <td class="text-muted" id="storeStatus">${user.address} - ${user.city}</td>
                        <td>
                            <button class="btn btn-primary" onclick="UserID(${user.id})">Details</button>
                        </td>
                    </tr>
                `;
            tableIndex++;
        });
    } else {
        // Handle cases where no user is found
        document.getElementById("UserTable").innerHTML = "<h3>No user was found that matches the search.</h3>";
    }

});







///////////////////////////////////// flter by city

document.getElementById("userCity").addEventListener("change", async function () {
    // debugger
    let city = this.value;

    if (city == "all") {
        getAllUsers();
        return;
    }

    const url = `https://localhost:7158/api/AdminUsers/getusersByCity/${city}`;
    const response = await fetch(url);

    if (response.ok) {

        let statusData = await response.json();

        const table = document.getElementById("UserTable");
        table.innerHTML = "";

        let tableIndex = 1;

        statusData.forEach(element => {

            table.innerHTML += `
                            <tr>
                                <td>${tableIndex}</td>
                                <td>
                                    <div class="avatar avatar-md">
                                        <img src="../../images/${element.image}" alt="${element.name}'s image" class="avatar-img rounded-circle" style="width:5em; height: 5em; object-fit: cover">
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted"><strong>${element.name}</strong></p>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted">${element.email}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.address} - ${element.city}</td>
                                <td>
                                    <button class="btn btn-primary" href="AdminUserDetails.html" onclick="UserID(${element.id})">Details</button>
                                </td>
                            </tr>
         `;
            tableIndex++;
        })

    }
    else {

        const table = document.getElementById("UserTable");
        table.innerHTML = "";
        table.innerHTML = "<h3>no user was found that lives in the city choosen</h3>"

    }
})


////////////////////////////////////// filter by business

document.getElementById("userBusiness").addEventListener("change", async function () {
    // debugger
    let bool = this.value;

    if (bool == "all") {
        getAllUsers();
        return;
    }

    const url = `https://localhost:7158/api/AdminUsers/getBusinessOwners/${bool}`;
    const response = await fetch(url);

    if (response.ok) {

        let statusData = await response.json();

        const table = document.getElementById("UserTable");
        table.innerHTML = "";

        let tableIndex = 1;

        statusData.forEach(element => {

            table.innerHTML += `
                            <tr>
                                <td>${tableIndex}</td>
                                <td>
                                    <div class="avatar avatar-md">
                                        <img src="../../images/${element.image}" alt="${element.name}'s image" class="avatar-img rounded-circle" style="width:5em; height: 5em; object-fit: cover">
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted"><strong>${element.name}</strong></p>
                                </td>
                                <td>
                                    <p class="mb-0 text-muted">${element.email}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.address} - ${element.city}</td>
                                <td>
                                    <button class="btn btn-primary" href="AdminUserDetails.html" onclick="UserID(${element.id})">Details</button>
                                </td>
                            </tr>
         `;
            tableIndex++;
        })

    }
    else {

        const table = document.getElementById("UserTable");
        table.innerHTML = "";
        table.innerHTML = "<h3>no user was found that lives in the city choosen</h3>"

    }
})


