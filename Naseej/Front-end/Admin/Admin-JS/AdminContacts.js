// debugger
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

    const url = "https://localhost:7158/api/AdminContact/getAllMessages";

    const response = await fetch(url);
    let data = await response.json();

    const table = document.getElementById("ContactsTable");
    table.innerHTML = "";

    let tableIndex = 1;

    data.forEach(element => {

        table.innerHTML += `
        <tr>
                                <td>${tableIndex}</td>
                                <td>
                                <p class="mb-0">${element.senderName}</p>
                                </td>
                                <td>
                                <p class="mb-0">${element.senderEmail}</p>
                                </td>
                                <td>
                                <p class="mb-0">${element.subject}</p>
                                </td>
                                <td>
                                <p class="mb-0">${element.message}</p>
                                </td>
                                <td class="text-muted" id="storeStatus">${element.status}</td>
                                <td>
                                    <a class="btn btn-primary" href="AdminContactsDetails.html" onclick="messID(${element.id})">Details</a>
                                </td>
                            </tr>        
        `;

        tableIndex++;

    });


}

/////////////////////////////////////////////// filters

async function filterContacts() {

    const url = "https://localhost:7158/api/AdminContact/filterContacts";
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameAndEmail: document.getElementById('contactNameEmailSearch').value,
                status: document.getElementById('inlineFormCustomSelectPref').value,
                subject: document.getElementById('contactSubjectSearch').value,
            })
        }
    );

    if (response.ok) {
        let data = await response.json();

        const table = document.getElementById("ContactsTable");
        table.innerHTML = "";

        let tableIndex = 1;

        data.forEach(element => {

            table.innerHTML += `
                                    <tr>
                                        <td>${tableIndex}</td>
                                        <td>
                                        <p class="mb-0">${element.senderName}</p>
                                        </td>
                                        <td>
                                        <p class="mb-0">${element.senderEmail}</p>
                                        </td>
                                        <td>
                                        <p class="mb-0">${element.subject}</p>
                                        </td>
                                        <td>
                                        <p class="mb-0">${element.message}</p>
                                        </td>
                                        <td class="text-muted" id="storeStatus">${element.status}</td>
                                        <td>
                                            <a class="btn btn-primary" href="AdminContactsDetails.html" onclick="messID(${element.id})">Details</a>
                                        </td>
                                    </tr>
                                `;

            tableIndex++;

        });

    }
    else {

        const table = document.getElementById("ContactsTable");
        table.innerHTML = "";
        table.innerHTML = "<h3>no contact was found that matches the search</h3>"

    }

}


///////////////////////////////////////////////// message id

function messID(messId) {

    localStorage.setItem("adminMessId", messId);
    window.location.href = "AdminContactsDetails.html";

}
