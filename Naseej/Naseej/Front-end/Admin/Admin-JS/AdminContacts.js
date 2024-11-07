document.addEventListener('DOMContentLoaded', () => {

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




function messID(messId){

    localStorage.setItem("adminMessId", messId);
    window.location.href = "AdminContactsDetails.html";

}
