

const admin = localStorage.getItem('isAdmin');


const userId = localStorage.getItem("AdminUserID");

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

        let color = "";
        switch (element.status) {
            case 'proccessing':
                color = "orange";
                break;
            case 'shipping':
                color = "gold";
                break;
            case 'delivered':
                color = "blue";
                break;
            case 'completed':
                color = "green";
                break;
            case 'canceled':
                color = "red";
                break;
            case 'error':
                color = "red";
                break;
        }

        let color2 = "";
        switch (element.op.status) {
            case 'proccessing':
                color2 = "orange";
                break;
            case 'paid':
                color2 = "green";
                break;
            case 'error':
                color2 = "red";
                break;
        }

        orderHistoryTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${element.id}</td>
                <td>${formatDate(new Date(element.orderDate))}</td>
                <td>${element.finalTotal}</td>
                <td id="order-status" style="color:${color}">${element.status}</td>
                <td  id="payment-status" style="color:${color2}">${element.op.status}</td>
                <td>${element.op.paymentMethod}</td>
                <td>
                    <a class="details-button" data-toggle="modal" data-target="#detailsModal" onclick="getDetails(${element.id})">Detail</a>                </td>
            </tr>
        `;
    });

}

async function getDetails(orderid) {

    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    const data = await response.json();

    let modalTableBody = document.getElementById("modalOrderItemsTableBody");
    modalTableBody.innerHTML = "";

    data.forEach(element => {

        if (element.id === orderid) {

            element.oi.forEach(item => {

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
            localStorage.setItem("orderDetailsId", orderid);
        }
    });
}


//////////////////////////////////////// update status


async function updateOrderStatus() {
    // debugger

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

        Swal.fire({
            icon: "success",
            title: "Order Status has been updated successfully",
            showConfirmButton: false,
            timer: 2000,
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

        getOrderHistory()

    } else {
        Swal.fire({
            title: "Error",
            text: "Failed to update order status. Please try again.",
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

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');


    return `${hours}:${minutes} ${year}/${month}/${day}`;
}

////////////////////////////////////////

function openIssueContainer() {
    const container = document.getElementById("issueSelectContainer");
    container.style.display = "block";
}

function cancelErrorMessage() {
    const container = document.getElementById("issueSelectContainer");
    container.style.display = "none";
}

async function sendErrorMessage() {
    // debugger
    const orderId = localStorage.getItem('orderDetailsId');

    const issueType = document.querySelector('input[name="issueType"]:checked').value;

    const url = `https://localhost:7158/api/CartAndOrder/OrderContacts/${orderId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueType)
    });

    if (response.ok) {

        Swal.fire({
            icon: "success",
            title: "The message has been sent successfully",
            showConfirmButton: false,
            timer: 2000,
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


////////////////////////

async function filterOrderStatus() {
    debugger
    const status = document.getElementById('orderStatus').value;

    if (status === "all") {
        getOrderHistory();
        return;
    }

    const url = `https://localhost:7158/api/Profile/filterUserOrderStatus/${userId}/${status}`;
    const response = await fetch(url);

    const orderHistoryTable = document.getElementById("orderHistoryTableBody");

    if (!response.ok) {
        orderHistoryTable.innerHTML = "<h3>no order was found that matches the status choosen</h3>"
    }
    const data = await response.json();

    orderHistoryTable.innerHTML = '';

    data.forEach((element, index) => {
        let color = "";
        switch (element.status) {
            case 'proccessing':
                color = "orange";
                break;
            case 'shipping':
                color = "gold";
                break;
            case 'delivered':
                color = "blue";
                break;
            case 'completed':
                color = "green";
                break;
            case 'canceled':
                color = "red";
                break;
            case 'error':
                color = "red";
                break;
        }

        let color2 = "";
        switch (element.op.status) {
            case 'proccessing':
                color2 = "orange";
                break;
            case 'paid':
                color2 = "green";
                break;
            case 'error':
                color2 = "red";
                break;
        }

        orderHistoryTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${element.id}</td>
                <td>${formatDate(new Date(element.orderDate))}</td>
                <td>${element.finalTotal}</td>
                <td id="order-status" style="color:${color}">${element.status}</td>
                <td  id="payment-status" style="color:${color2}">${element.op.status}</td>
                <td>${element.op.paymentMethod}</td>
                <td>
                    <a class="details-button" data-toggle="modal" data-target="#detailsModal" onclick="getDetails(${element.id})">Detail</a>                </td>
            </tr>
        `;
    });
}



async function updatePaymentStatus() {
    debugger

    const selectedStatus = document.getElementById('PaymentStatusSelect').value;
    const selectedOrderId = localStorage.getItem('orderDetailsId');

    const url = `https://localhost:7158/api/CartAndOrder/updatePaymentStatus/${selectedOrderId}`;


    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStatus)
    });

    if (response.ok) {

        const statusCell = document.getElementById('payment-status');
        statusCell.innerText = selectedStatus;

        Swal.fire({
            icon: "success",
            title: "Payment Status has been updated successfully",
            showConfirmButton: false,
            timer: 2000,
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

        getOrderHistory()

    } else {
        Swal.fire({
            title: "Error",
            text: "Failed to update payment status. Please try again.",
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







