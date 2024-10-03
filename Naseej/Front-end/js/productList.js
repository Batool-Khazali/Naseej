

///////////// price slider settings

$(function () {
    // Fetch the price range dynamically from your API
    $.ajax({
        url: 'https://localhost:7158/api/Products/prices',
        type: 'GET',
        success: function (data) {
            const minPrice = data.minPrice;
            const maxPrice = data.maxPrice;

            // Initialize the slider with dynamic values
            $("#price-slider").slider({
                range: true,
                min: minPrice,
                max: maxPrice,
                step: 0.01,
                values: [minPrice, maxPrice],
                slide: function (event, ui) {
                    $("#price-slider-amount").text(ui.values[1] + " - " + ui.values[0] + " دينار أردني");
                    // Update product list based on the selected price range
                    filterProducts(ui.values[0], ui.values[1]);
                }
            });

            // Set initial value display in reverse order for RTL
            $("#price-slider-amount").text(maxPrice + " - " + minPrice + " دينار أردني");

            // Load initial product list
            filterProducts(minPrice, maxPrice);
        },
        error: function () {
            // alert('Failed to fetch price range.');
        }
    });
});

/////////////price filter


async function filterProducts(minPrice, maxPrice) {
    const url = `https://localhost:7158/api/Products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`;

    const response = await fetch(url);
    let data = await response.json();

    const productContainer = document.getElementById("productListCardsContainer");
    productContainer.innerHTML = '';

    data.forEach(element => {
        productContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card mb-4 product-card">
                            <div class="pro-img-box">
                                <img src="../../images/${element.image}" class="img-fluid" alt="${element.name}" />
                                <a href="#" class="add-to-cart">
                                    <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                                </a>
                                <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})" >
                                    <i class="fa fa-info-circle"></i>
                                </a>
                            </div>
                            <div class="card-body text-center">
                                <h4><a href="#" class="product-title">${element.name}</a></h4>
                                <p class="Desc">${element.description}</p>
                                <p class="price">${element.price} دينار أردني</p>
                            </div>
                        </div>
                    </div>
        `;
    });
}



////////////////////////////////////////////// fill color checkbox


async function fillColorCheck() {
    const url = "https://localhost:7158/api/Products/ProColors";
    let response = await fetch(url);
    let data = await response.json();

    const colorContainer = document.getElementById("ProColorList");

    data.forEach(element => {
        colorContainer.innerHTML += `
            <input type="checkbox" name="${element}" id="${element}" value="${element}" class="color-checkbox" onclick="colorFilter()">
            <label for="${element}">
                <span class="productsColor" style="background-color: ${element};"> </span>
            </label>
            <br>
        `;
    });
}

fillColorCheck();


///////////////////////////////// fill list 
// debugger
let typeFilter = localStorage.getItem("ProType");

if (typeFilter == null) {
    var url = 'https://localhost:7158/api/Products/getAll';
}
else {
    var url = `https://localhost:7158/api/Products/getProByType/${typeFilter}`;
}


async function fill() {
    // debugger
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);

    const container = document.getElementById("productListCardsContainer");
    container.innerHTML = ""

    data.forEach(element => {
        container.innerHTML += `
        <div class="col-md-4">
                        <div class="card mb-4 product-card">
                            <div class="pro-img-box">
                                <img src="../../images/${element.image}" class="img-fluid"
                                    alt="" />
                                <a href="#" class="add-to-cart">
                                    <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                                </a>
                                <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                                    <i class="fa fa-info-circle"></i>
                                </a>
                            </div>
                            <div class="card-body text-center">
                                <h4><a href="#" class="product-title">${element.name}</a></h4>
                                <p class="Desc">${element.description}</p>
                                <p class="price">${element.price} دينار أردني</p>
                            </div>
                        </div>
                    </div>
        `;
    });
    localStorage.removeItem("ProType");
}
fill();


///////////////////////////////////// fill list categories

async function CatList(CatName, SubCatName) {
    const url = `https://localhost:7158/api/Products/getProByCat/${CatName}/${SubCatName}`;
    let response = await fetch(url);
    let data = await response.json();

    const container = document.getElementById("productListCardsContainer");
    container.innerHTML = ""
    data.forEach(element => {
        container.innerHTML += `
        <div class="col-md-4">
                        <div class="card mb-4 product-card">
                            <div class="pro-img-box">
                                <img src="../../images/${element.image}" class="img-fluid"
                                    alt="" />
                                <a href="#" class="add-to-cart">
                                    <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                                </a>
                                <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                                    <i class="fa fa-info-circle"></i>
                                </a>
                            </div>
                            <div class="card-body text-center">
                                <h4><a href="#" class="product-title">${element.name}</a></h4>
                                <p class="Desc">${element.description}</p>
                                <p class="price">${element.price} دينار أردني</p>
                            </div>
                        </div>
                    </div>
        `;
    });
}


async function GenList(CatName) {
    const url = `https://localhost:7158/api/Products/getProByCat/${CatName}`;
    let response = await fetch(url);
    let data = await response.json();
    const container = document.getElementById("productListCardsContainer");
    container.innerHTML = ""
    data.forEach(element => {
        container.innerHTML += `
        <div class="col-md-4">
                        <div class="card mb-4 product-card">
                            <div class="pro-img-box">
                                <img src="../../images/${element.image}" class="img-fluid"
                                    alt="" />
                                <a href="#" class="add-to-cart">
                                    <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                                </a>
                                <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                                    <i class="fa fa-info-circle"></i>
                                </a>

                            </div>
                            <div class="card-body text-center">
                                <h4><a href="#" class="product-title">${element.name}</a></h4>
                                <p class="Desc">${element.description}</p>
                                <p class="price">${element.price} دينار أردني</p>
                            </div>
                        </div>
                    </div>
        `;
    });
}


///////////////////////////////////////////////// color filter


async function colorFilter() {
    const checkboxes = document.querySelectorAll('.color-checkbox');

    let selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // console.log("Selected colors:", selectedColors);

    if (selectedColors.length > 0) {
        const url = `https://localhost:7158/api/Products/getProByColor?${selectedColors.map(color => `color=${color}`).join('&')}`;


        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log("Fetched data:", data);

        const container = document.getElementById("productListCardsContainer");
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = '<p>No products found for the selected colors.</p>';
            return;
        }

        data.forEach(element => {
            container.innerHTML += `
                    <div class="col-md-4">
                        <div class="card mb-4 product-card">
                            <div class="pro-img-box">
                                <img src="../../images/${element.image}" class="img-fluid" alt="${element.name}" />
                                <a href="#" class="add-to-cart">
                                    <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                                </a>
                                <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                                    <i class="fa fa-info-circle"></i>
                                </a>

                            </div>
                            <div class="card-body text-center">
                                <h4><a href="#" class="product-title">${element.name}</a></h4>
                                <p class="Desc">${element.description}</p>
                                <p class="price">${element.price} دينار أردني</p>
                            </div>
                        </div>
                    </div>
                `;
        });
    } else {
        fill(); // Fetch all products and display them
    }
}


////////////////////////////////////////////// search function


async function SearchName() {
    let searchText = document.getElementById("nameSearch").value;

    if (searchText == "" || searchText == null) {
        fill();
        return;
    }

    const url = `https://localhost:7158/api/Products/textSearch?text=${searchText}`;
    try {
        let response = await fetch(url);

        if (response.status === 404) {
            const container = document.getElementById("productListCardsContainer");
            container.innerHTML = `<h3>لا يوجد أي منتج يطابق البحث.</h3>
            <p>الرجاء توسعة نطاق البحث</p>`;
            return;
        }

        let data = await response.json();

        const container = document.getElementById("productListCardsContainer");
        container.innerHTML = "";

        data.forEach(element => {
            container.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4 product-card">
                    <div class="pro-img-box">
                        <img src="../../images/${element.image}" class="img-fluid" alt="" />
                        <a href="#" class="add-to-cart">
                            <i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
                        </a>
                        <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                            <i class="fa fa-info-circle"></i>
                        </a>
                    </div>
                    <div class="card-body text-center">
                        <h4><a href="#" class="product-title">${element.name}</a></h4>
                        <p class="Desc">${element.description}</p>
                        <p class="price">${element.price} دينار أردني</p>
                    </div>
                </div>
            </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}



/////////////////////////////////////////////////////////////////////// go to details page

async function checkDetailes(id) {

    localStorage.setItem("ProId", id);

}



///////////////////////////////////////////////////////////////// add cart item to local

async function addToCartFromList(id) {
    debugger
    const quantity = document.getElementById("productQuantity") ? document.getElementById("productQuantity").value : 1;

    const colorOption = document.querySelector('input[name="color"]:checked');
    let color = colorOption ? colorOption.value : null;
    // console.log(color);

    localStorage.setItem("ProId", id);
    proid= localStorage.getItem("ProId");
    console.log(proid);
    console.log(id);

    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/CartAndOrder/addCartItems/${userId}`;

    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: Number(id),
                quantity: Number(quantity),
                color: color,
            })
        }
    );

    // localStorage.setItem(`item${id}`, JSON.stringify({
    //   productId: Number(id),
    //   quantity: Number(quantity),
    //   color: color,
    //   price: Number(price),
    // })
    // );
    // console.log(localStorage.getItem(`item${ProId}`));

    // if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "لقد تمت إضافة المنتج إلى العربة بنجاح",
            showConfirmButton: false,
            timer: 1000,
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
    // }
    // else{
    //     Swal.fire({
    //         icon: "error",
    //         // title: "",
    //         text: "يبدو أن هنالك خطا ما",
    //         footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>'
    //       });
    // }



}























