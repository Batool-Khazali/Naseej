

const userId = localStorage.getItem("AdminUserID");

document.addEventListener('DOMContentLoaded', () => {
    getOrderHistory();
});



////////////////////////////////////////////////////////////

async function getOrderHistory() {
    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    const data = await response.json();

    const orderHistoryTable = document.getElementById("orderHistoryTableBody");
    orderHistoryTable.innerHTML = '';

    data.forEach((element, index) => {
        orderHistoryTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
<td>${formatDate(new Date(element.orderDate))}</td>

                <td>${element.finalTotal}</td>
                <td id="order-status">${element.status}</td>
                <td >${element.op.status}</td>
                <td>${element.op.paymentMethod}</td>
                <td><a class="details-button" onclick="showOrderDetails(${index})">Detail</a></td>
            </tr>
        `;
    });
    window.orderData = data;  // Store data globally for modal access
}

function showOrderDetails(index) {

    console.log(window.orderData[index].id)
    localStorage.setItem('orderDetailsId' , window.orderData[index].id);

    const orderItems = window.orderData[index].oi;
    
    const modalTableBody = document.getElementById('modalOrderItemsTable').querySelector('tbody');
    modalTableBody.innerHTML = "";

    orderItems.forEach(item => {

        const total = item.priceAtPurchase * item.quantity

        modalTableBody.innerHTML += `
            <tr>
                <td><img src="../../images/${item.ip.image}" alt="${item.ip.name}" width="50"></td>
                <td>${item.ip.name}</td>
                <td>${item.quantity}</td>
                <td>${item.priceAtPurchase}</td>
                <td>${total}</td>
                <td>${item.color}</td>
            </tr>
        `;
    });

    // Show the modal
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    orderDetailsModal.show();
}



async function updateOrderStatus() {
    debugger

    const selectedStatus = document.getElementById('orderStatusSelect').value;
    const selectedOrderId = localStorage.getItem('orderDetailsId');

    const url = `https://localhost:7158/api/CartAndOrder/changeOrderStatus/${selectedOrderId}`;

    
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStatus)
    });
    
    if (response.ok) {

        const statusCell = document.getElementById('order-status');
        statusCell.innerText = selectedStatus;

        getOrderHistory()

    } else {
        throw new Error('Failed to update order status');
    }


}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-11) and pad
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Format the date
}








