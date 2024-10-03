
const userId = localStorage.getItem('userId');



document.addEventListener('DOMContentLoaded', function () {
    getUserInfo();

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
                                            <p class="text-muted mb-0 mt-1">${element.priceAtPurchase} x ${element.quantity}</p>
                                        </td>
                                        <td>${total} دينار أردني</td>
                                    </tr>
        `
    
    });

    let fianal = sum + 1;

    document.getElementById("tottal").innerHTML = `${sum} دينار أردني`;
    document.getElementById("finalPrice").innerHTML = `${fianal} دينار أردني`;
}


//////////////////////////////////// checkout

// async function checkout()
// {
//     const url = `https://localhost:7158/api/CartAndOrder/createOrder/${userId}`;

//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
            
//         })
//     });

//     const data = await response.json();


// }






