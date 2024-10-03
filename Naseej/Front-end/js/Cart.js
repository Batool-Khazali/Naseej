

function goToCheckOut() {
    location.href = "Checkout.html"
}


////////////////////////// fill cart table

const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded",  function() {
  getCartItems();
  
});


async function getCartItems()
{
  const url =`https://localhost:7158/api/CartAndOrder/getUserCartItems/${userId}`;
  const response = await fetch(url);
  let data = await response.json();

  const cartItemsTable = document.getElementById("cartItemsTable");
  cartItemsTable.innerHTML = "";

  data.forEach(element => {
    let price = element.priceAtPurchase * element.quantity
    cartItemsTable.innerHTML += `
                                            <div class="row mb-4 d-flex justify-content-between align-items-center">
                                            <div class="col-md-2 col-lg-2 col-xl-2">
                                                <img src="../../images/${element.p.image}"
                                                    class="img-fluid rounded-3" alt="Cotton T-shirt">
                                            </div>
                                            <div class="col-md-3 col-lg-3 col-xl-3">
                                                <h6 class="mb-0">${element.p.name}</h6>
                                            </div>
                                            
                                            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                <button data-mdb-button-init data-mdb-ripple-init
                                                    class="btn btn-link px-2"
                                                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                                    <i class="fas fa-minus"></i>
                                                </button>

                                                <input id="form1" min="0" name="quantity" value="${element.quantity}" type="number"
                                                    class="form-control form-control-sm" />

                                                <button data-mdb-button-init data-mdb-ripple-init
                                                    class="btn btn-link px-2"
                                                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                <h6 class="mb-0">${price} دينار أردني</h6>
                                            </div>
                                            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                                <button type="button" onclick="deleteItem(${element.productId})" class="text-muted"><i class="fas fa-times"></i></button>
                                            </div>
                                        </div>

                                        <hr class="my-4">
    `
  });

}


//////////////////////////////////////////////// delete item

async function deleteItem(productId)
{
  // debugger
  const url =`https://localhost:7158/api/CartAndOrder/deleteCartItem/${userId}/${productId}`;
  await fetch(url, {
    method: 'DELETE',
  });

  getCartItems();
}


////////////////////////////////// cart total

async function getCartTotal()
{
  const url =`https://localhost:7158/api/CartAndOrder/getcartPrice/${userId}`;
  const response = await fetch(url);
  let data = await response.json();

  document.getElementById("CartItemTotal").innerText = data + " دينار أردني";

  let final = data + 1;

  document.getElementById("cartFinalTotal").innerHTML = final + " دينار أردني";
}

getCartTotal();

///////////////////////////////////////

















