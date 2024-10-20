
const userId = localStorage.getItem('userId');



document.addEventListener('DOMContentLoaded', function () {
    getUserInfo();

    orderTable();

});


///////////////////////

async function getUserInfo() {

    const url = `https://localhost:7158/api/CartAndOrder/getUserInfo/${userId}`;

    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("billing-name").value = data.name;
    document.getElementById("billing-email-address").value = data.email;
    document.getElementById("billing-phone").value = data.phone;
}

/////////////////////////////////////

async function orderTable()
{
    // debugger
    const url = `https://localhost:7158/api/CartAndOrder/getUserOrder/${userId}`;
    const response = await fetch(url);
    const data = await response.json();

    const table = document.getElementById("orderTable");
    table.innerHTML = "";

    let sum = 0;

    data.forEach(element => {
        let total = element.priceAtPurchase * element.quantity; 
        sum += total;
        table.innerHTML +=`
                                            <tr>
                                        <th scope="row"><img src="../../images/${element.p.image}"
                                                alt="product-img" title="product-img" class="avatar-lg rounded"></th>
                                        <td>
                                            <h5 class="font-size-16 text-truncate"><a
                                                    class="text-dark">${element.p.name}</a></h5>
                                            <p class="text-muted mb-0 mt-1">${element.priceAtPurchase} دينار <span> * </span> ${element.quantity}</p>
                                        </td>
                                        <td>${total} دينار أردني</td>
                                    </tr>
                                    
                        `
    
    });

    let fianal = (sum + 2).toFixed(2);
    
    table.innerHTML += `
                        <tr>
                            <td colspan="2">
                                <h5 class="font-size-14 m-0">المجموع :</h5>
                            </td>
                            <td id="tottal">
                                ${(sum).toFixed(2)} دينار أردني
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">
                                <h5 class="font-size-14 m-0">التوصيل :</h5>
                            </td>
                            <td>
                                2
                            </td>
                        </tr>
            
                        <tr class="bg-light">
                            <td colspan="2">
                                <h5 class="font-size-14 m-0">النهائي:</h5>
                            </td>
                            <td id="finalPrice">
                                ${fianal} دينار أردني
                            </td>
                        </tr>
                    `;
}


//////////////////////////////////// checkout

async function checkout()
{
    // debugger
    const paymentMethods = document.getElementsByName('pay-method');
    let selectedMethod;

    for (const method of paymentMethods) {
        if (method.checked) {
            selectedMethod = method.value;
            // console.log(method.value);
            break;
        }
    };

    let gov = document.getElementById('user-governate').value;
    let address = document.getElementById('billing-address').value;
    let city = document.getElementById('user-city').value;
    // console.log(address, city, gov);

    if(city == "0") {
        Swal.fire({
            icon: "error",
            text: "الرجاء اختيار المحافظة",
        });
        return;
    };

    const url = `https://localhost:7158/api/CartAndOrder/payment/${userId}?method=${selectedMethod}`;
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shippingAddress : address,
                city : city,
                governate : gov,
            })
        });
    
        if (response.ok)
        {
            Swal.fire({
                icon: "success",
                title: "لقد تم إنهاء الطلب بنجاح",
                text: "سيتم إرسال الطلب إليك",
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
        else {
            Swal.fire({
                icon: "error",
                // title: "",
                text: "يبدو أن هنالك خطا ما",
                footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>'
            });
        };
};



// function initPayPalButton() {

//     // const total = localStorage.getItem('totalAmount');
//     // let totalValue = total ? parseFloat(total) : 99.99;

//     paypal.Buttons({
//         style: {
//             shape: 'rect',
//             color: 'gold',
//             layout: 'vertical',
//             label: 'paypal',
//         },

//         createOrder: function (data, actions) {
//             return actions.order.create({
//                 purchase_units: [{ "amount": { "currency_code": "USD", "value": 99.55 } }]
//             });
//         },

//         onApprove: function (data, actions) {
//             return actions.order.capture().then(function (orderData) {

//                 // Full available details
//                 console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

//                 // Show a success message within this page, for example:
//                 const element = document.getElementById('paypal-button-container');
//                 element.innerHTML = '';
//                 element.innerHTML = '<h3>Thank you for your payment!</h3>';

//                 // Or go to another URL:  actions.redirect('thank_you.html');

//                 const orderid = localStorage.getItem("orderID");
                
//                 // async function completeTXN() {
//                 //     // update status of the order in the database to "Paid" 
//                 //     // add transaction id to the order

//                 //     const editOrderURL = `https://localhost:7198/api/Orders/FinishOrder/${orderid}`;

//                 //     let response = await fetch(editOrderURL, {
//                 //         method: 'PUT',
//                 //         headers: {
//                 //             'Content-Type': 'application/json'
//                 //         },
//                 //         body: JSON.stringify({ userId: userid })
//                 //     });
//                 // };
//                 // completeTXN();

//                 // async function AddPoint() {
                    
//                 //     const AddPointsURL = `https://localhost:7198/api/EarnPoints/AddPointToUser/${userID}/${orderid}`;

//                 //     let response = await fetch(AddPointsURL, {
//                 //         method: 'PUT',
//                 //         headers: {
//                 //             'Content-Type': 'application/json'
//                 //         },
//                 //         body: JSON.stringify()
//                 //     });
//                 // };
//                 // AddPoint();

//                 document.getElementById("finishOrder").style.display = "block";

//             });
//         },

//         onError: function (err) {
//             console.log(err);
//         }
//     }).render('#paypal-button-container');
// };
// initPayPalButton();





