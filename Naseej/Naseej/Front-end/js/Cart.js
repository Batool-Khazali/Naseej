

document.addEventListener("DOMContentLoaded", function () {
  getCartItems();

  getCartTotal();

});




////////////////////////// fill cart table

let userId = localStorage.getItem("userId");

const token = localStorage.getItem("jwtToken");


async function getCartItems() {

  const cartItemsTable = document.getElementById("cartItemsTable");
  cartItemsTable.innerHTML = "";

  if (token) {

    debugger
    const url = `https://localhost:7158/api/CartAndOrder/getUserCartItems/${userId}`;
    const response = await fetch(url);

    if (!response.ok) {
      cartItemsTable.innerHTML += `
                                  <tr>
                                    <td colspan="5" class="text-center"><h4>عربة التسوق فارغة أو بانتظار اتمام عملية الشراء </h4></td>
                                  </tr>`;
      return;
    }


    let data = await response.json();

    data.forEach(element => {
      let price = element.priceAtPurchase * element.quantity
      cartItemsTable.innerHTML += `
                                      <div class="row mb-4 d-flex justify-content-between align-items-center">
                                      <div class="col-md-2 col-lg-2 col-xl-2">
                                          <img src="../../images/${element.p.image}"
                                              class="img-fluid rounded-3" alt="Cotton T-shirt">
                                      </div>
                                      <div class="col-md-3 col-lg-3 col-xl-3">
                                          <h6 class="mb-0">${element.p.name} - 
                                          <span style="background-color: ${element.color}; color: ${element.color}; display: inline-block; width: 1em; height: 1em; border-radius: 50%;"></span>
                                          </h6>
                                      </div>
                                      
                                      <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                        <button class="btn btn-link px-2" onclick="updateQuantity(this, -1, ${element.priceAtPurchase}, ${element.productId})">
                                          <i class="fas fa-minus"></i>
                                        </button>
                                        <input id="quantity-${element.productId}" min="1" name="quantity" value="${element.quantity}" type="number" class="form-control form-control-sm" readonly />
                                        <button class="btn btn-link px-2" onclick="updateQuantity(this, 1, ${element.priceAtPurchase}, ${element.productId})">
                                          <i class="fas fa-plus"></i>
                                        </button>
                                      </div>
                                      <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                          <h6 class="mb-0" id="price-${element.productId}">${price} دينار أردني</h6>
                                      </div>
                                      <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                          <button type="button" onclick="deleteItem(${element.productId})" class="text-muted"><i class="fas fa-times"></i></button>
                                      </div>
                                      </div>

                                      <hr class="my-4">
                                  `
    });

  }
  else {
    debugger
    let LSItems = [];

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("item")) {
        LSItems.push(JSON.parse(localStorage.getItem(key)));
      }
    }

    if (LSItems.length <= 0) {
      cartItemsTable.innerHTML += `
                                  <tr>
                                    <td colspan="5" class="text-center">No items in the cart</td>
                                  </tr>`;
      return;
    }


    LSItems.forEach(element => {

      let final = element.price * element.quantity
      cartItemsTable.innerHTML += `
                                      <div class="row mb-4 d-flex justify-content-between align-items-center">
                                      <div class="col-md-2 col-lg-2 col-xl-2">
                                          <img src="../../images/${element.image}"
                                              class="img-fluid rounded-3" alt="Cotton T-shirt">
                                      </div>
                                      <div class="col-md-3 col-lg-3 col-xl-3">
                                          <h6 class="mb-0">${element.name} - 
                                          <span style="background-color: ${element.color}; color: ${element.color}; display: inline-block; width: 1em; height: 1em; border-radius: 50%;"></span>
                                          </h6>
                                      </div>
                                      
                                      <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                        <button class="btn btn-link px-2" onclick="updateQuantity(this, -1, ${element.price}, ${element.productId})">
                                          <i class="fas fa-minus"></i>
                                        </button>
                                        <input id="quantity-${element.productId}" min="1" name="quantity" value="${element.quantity}" type="number" class="form-control form-control-sm" readonly />
                                        <button class="btn btn-link px-2" onclick="updateQuantity(this, 1, ${element.price}, ${element.productId})">
                                          <i class="fas fa-plus"></i>
                                        </button>
                                      </div>
                                      <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                          <h6 class="mb-0" id="price-${element.productId}">${final} دينار أردني</h6>
                                      </div>
                                      <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                          <button type="button" onclick="deleteItem(${element.productId})" class="text-muted"><i class="fas fa-times"></i></button>
                                      </div>
                                      </div>

                                      <hr class="my-4">
                                  `
    });



  }

}

////////////////////////////////////////////////////// update quantity

function updateQuantity(button, change, priceAtPurchase, productId) {

  //debugger
  const quantityInput = document.getElementById(`quantity-${productId}`);
  let newQuantity = parseInt(quantityInput.value) + change;

  if (newQuantity <= 0) {
    newQuantity = 1;
  }

  // Update quantity input
  quantityInput.value = newQuantity;

  // Update price using new quantity
  const newPrice = priceAtPurchase * newQuantity;
  const priceField = document.getElementById(`price-${productId}`);
  priceField.textContent = `${newPrice} دينار أردني`;


  //// update quantity in DB and LS
  updateDbAndLs(productId, newQuantity)
  getCartTotal();
}


async function updateDbAndLs(ProId, newQuantity) {

  debugger
  if (token) {

    const url = `https://localhost:7158/api/CartAndOrder/changeQuantity/${userId}/${ProId}?quantity=${newQuantity}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQuantity
      }),
    });

  }
  else {
    const itemKey = `item${ProId}`;
    const cartItem = JSON.parse(localStorage.getItem(itemKey));

    if (cartItem) {
      // Update the quantity in local storage
      cartItem.quantity = newQuantity;
      localStorage.setItem(itemKey, JSON.stringify(cartItem));
    }
  }
}


///////////////////////////////////////////////////////// delete item

async function deleteItem(productId) {
  // debugger

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "هل انت متأكد من حذف المنتج?",
    // text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم, احذف المنتج من السلة!",
    cancelButtonText: "لا, تراجع عن عملية الحذف!",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {

      finishDelete(productId)

      swalWithBootstrapButtons.fire({
        // title: "Your file has been deleted.",
        text: "تم الحذف بنجاح!",
        icon: "success"
      });

    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        // title: "Cancelled",
        text: "تم إلغاء العملية",
        icon: "error"
      });
    }
  });

  

}


async function finishDelete(productId){

  if (token) {

    const url = `https://localhost:7158/api/CartAndOrder/deleteCartItem/${userId}/${productId}`;
    await fetch(url, {
      method: 'DELETE',
    });
    getCartItems();

  }
  else {
    localStorage.removeItem(`item${productId}`);
    getCartItems();
  }
}


//////////////////////////////////////////////// cart total

async function getCartTotal() {
  debugger

  if (token) {

    const url = `https://localhost:7158/api/CartAndOrder/getcartPrice/${userId}`;
    const PriceResponse = await fetch(url);
    let priceData = await PriceResponse.json();

    console.log(priceData);

    document.getElementById("CartItemTotal").innerText = priceData.toFixed(2) + " دينار أردني";

    let final = (priceData + 2).toFixed(2);

    document.getElementById("cartFinalTotal").innerHTML = final + " دينار أردني";
  }
  else {
    let LStotal = 0;

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("item")) {
        let item = JSON.parse(localStorage.getItem(key));
        LStotal += item.price * item.quantity;
      }
  
      document.getElementById("CartItemTotal").innerText = LStotal.toFixed(2) + " دينار أردني";

      let LSfinal = (LStotal + 2).toFixed(2);
  
      document.getElementById("cartFinalTotal").innerHTML = LSfinal + " دينار أردني";
  }}
}



////////////////////////////////////////////// send Items to order


async function goToCheckOut() {



  if (!token) {
    localStorage.setItem("previousPage", "Cart")
    location.href = "Login.html"
  }

  const url = `https://localhost:7158/api/CartAndOrder/createOrderFromCart/${userId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({}),
  });

  location.href = "Checkout.html"

}
















