

const userId = localStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', () => {

    getOrderHistory();

    fillDetails();

});


/////////////////////////////// get order history

async function getOrderHistory() {

    // debugger
    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    let data = await response.json();

    const orderHistoryTable = document.getElementById("orderHistoryTableBody");
    orderHistoryTable.innerHTML = '';

    data.forEach((element, index) => {
        orderHistoryTable.innerHTML += `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${element.id}</td>
                                            <td>${element.orderDate}</td>
                                            <td>${element.finalTotal}</td>
                                            <td>${element.op.status}</td>
                                            <td  class="date">${element.op.date}</td>
                                            <td>${element.op.paymentMethod}</td>
                                            <td><a class="details-button" onclick="toggleOrderDetails(${index}, this)">التفاصيل</a></td>
                                        </tr>

                                        <tr class="details-row hidden"  id="details-row-${index}">
                                            <td colspan="8">
                                                <table class="details-table fl-table" id="details-table-${index}">
                                                    <thead>
                                                        <tr>
                                                            <th>صورة المنتج</th>
                                                            <th>اسم المنتج</th>
                                                            <th>الكمية</th>
                                                            <th>السعر</th>
                                                            <th>اللون</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        `;

    });
}



async function fillDetails() {

    // debugger
    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    let data = await response.json();



    data.forEach((element, index) => {

        const detailsTableBody = document.getElementById(`details-table-${index}`).querySelector('tbody');
        detailsTableBody.innerHTML = "";

        element.oi.forEach(x => {
            detailsTableBody.innerHTML += `
                                            <td><img src="../../images/${x.ip.image}" alt="${x.ip.name}"></td>
                                            <td>${x.ip.name}</td>
                                            <td>${x.quantity}</td>
                                            <td>${x.priceAtPurchase}</td>
                                            <td>${x.color}</td>
                                        `;
        })
    });

}

function toggleOrderDetails(index, element) {

    // debugger
    const detailsRow = document.getElementById(`details-row-${index}`);
    const isHidden = detailsRow.classList.contains('hidden');

    // Toggle the visibility of the details row
    if (isHidden) {
        detailsRow.classList.remove('hidden');
        element.textContent = 'إخفاء'; 
    } else {
        detailsRow.classList.add('hidden');
        element.textContent = 'التفاصيل'; 
    }
}









