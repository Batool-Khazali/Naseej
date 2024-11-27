

///////////// dynamic data 

//price
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
                    productsFilters.minPrice = ui.values[0];
                    productsFilters.maxPrice = ui.values[1];
                    productsListAndFilters();
                }
            });

            // Set initial value display in reverse order for RTL
            $("#price-slider-amount").text(maxPrice + " - " + minPrice + " دينار أردني");

            // Load initial product list
            productsListAndFilters();
        },
        error: function () {
            // alert('Failed to fetch price range.');
        }
    });
});

// colors
async function fillColorCheckBoxes() {
    const url = "https://localhost:7158/api/Products/ProColors";
    let response = await fetch(url);
    let data = await response.json();

    const colorContainer = document.getElementById("ProColorList");

    data.forEach(element => {
        colorContainer.innerHTML += `
            <input type="checkbox" name="${element}" id="${element}" value="${element}" class="color-checkbox" onclick="productsListAndFilters()">
            <label for="${element}">
                <span class="productsColor" style="background-color: ${element};"> </span>
            </label>
            <br>
        `;
    });
}
fillColorCheckBoxes();

// categories and sub categories
async function fillCategoryList() {

    const url = "https://localhost:7158/api/Products/getCategoriesAndSubCategories";
    const response = await fetch(url);
    const data = await response.json();

    let categoryList = document.getElementById("generalCategory");
    data.categories.forEach(category => {
        categoryList.innerHTML += `<li onclick="productsListAndFilters('${category}', '')">- ${category}</li>`;
    });

    //su categories
    const groupedCategories = data.categories.reduce((acc, category) => {
        acc[category] = data.subCategories
          .filter(sub => sub.name === category)
          .map(sub => sub.subCategory);
        return acc;
      }, {});
      
      let subCategoriesList = document.getElementById("categoryAndSubCategory");
      
      Object.entries(groupedCategories).forEach(([category, subCategories], index) => {
        // Generate unique ID for each category to control collapse
        const categoryId = `category${index}`;
        
        subCategoriesList.innerHTML += `
          <li>
            <a href="#" class="category-link" data-bs-toggle="collapse" data-bs-target="#${categoryId}">
              ${category} <span> </span><i class="fa fa-angle-left"></i>
            </a>
            <ul class="nav flex-column collapse" id="${categoryId}">
              ${subCategories.map(subCategory => `<li onclick="productsListAndFilters('${category}', '${subCategory}')">- ${subCategory}</li>`).join('')}
            </ul>
          </li>
        `;
      });
}
fillCategoryList()

// business Names

async function fillBusinessNames() {
    const url = "https://localhost:7158/api/Products/getBusinessNames";
    let response = await fetch(url);
    let data = await response.json();

    const businessContainer = document.getElementById("businessNameList");
    businessContainer.innerHTML = "";  // Clear the container first

    data.forEach(element => {
        businessContainer.innerHTML += `
            <input type="radio" name="businessName" id="${element}" value="${element}" class="business-radio" onclick="productsListAndFilters()">
            <label for="${element}">
                ${element}
            </label>
            <br>
        `;
    });
}
fillBusinessNames();



///////////////////////////////////////////// filtering

let productsFilters = {
    productName: "",
    categoryName: "",
    subCategoryName: "",
    color: [],
    businessName: "",
    businessGovernate: "",
    minPrice: null,
    maxPrice: null,
    page: 1,
    take: 9
};

function addFilters(categoryName, subCategoryName, page) {
    // debugger
    // name
    let searchText = document.getElementById("nameSearch").value;
    if (searchText) {
        productsFilters.productName = searchText;
    } else {
        productsFilters.productName = "";
    }

    // colors
    const checkboxes = document.querySelectorAll('.color-checkbox');
    let selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    if (selectedColors.length > 0) {
        productsFilters.color = selectedColors;
    } else {
        productsFilters.color = "";
    }
    
    // category and sub-category names
    productsFilters.categoryName = categoryName;
    productsFilters.subCategoryName = subCategoryName;

    // business name
    const selectedBusiness = document.querySelector('input[name="businessName"]:checked');
    if (selectedBusiness) {
        productsFilters.businessName = selectedBusiness.value;
    } else {
        productsFilters.businessName = "";
    }

    // business governate
    const selectedGovernate = document.querySelector('input[name="businessGovernate"]:checked');
    if (selectedGovernate) {
        productsFilters.businessGovernate = selectedGovernate.value;
    } else {
        productsFilters.businessGovernate = "";
    }

    // pagination
    productsFilters.page = page;
}

//////// get products
async function productsListAndFilters(categoryName, subCategoryName, page = 1) {
    debugger

    addFilters(categoryName, subCategoryName, page)

    const params = new URLSearchParams();

    Object.keys(productsFilters).forEach(key => {
        const value = productsFilters[key];
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else if (value || value === 0) {
            params.set(key, value);
        }
    });

    const url = `https://localhost:7158/api/Products/productsFilter?${params}`;
    const response = await fetch(url);

    if (response.ok) {
        let data = await response.json();
        const productList = data.list;
        console.log(productList)

        const container = document.getElementById("productListCardsContainer");
        container.innerHTML = ""

        if (data.list.length == 0) {
            const container = document.getElementById("productListCardsContainer");
            container.innerHTML = `<h3>لا يوجد أي منتج يطابق البحث.</h3>
            <p>الرجاء توسعة نطاق البحث</p>`;
            return;
        }

        data.list.forEach(element => {
            container.innerHTML += `
                <div class="col-md-4">
                                <div class="card mb-4 product-card">
                                    <div class="pro-img-box">
                                        <img src="../../images/${element.image}" class="img-fluid"
                                            alt="" />
        
                                        <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
                                            <i class="fa fa-info-circle"></i>
                                        </a>
                                    </div>
                                    <div class="card-body text-center">
                                        <h4>${element.name}</h4>
                                        <p class="Desc">${element.description}</p>
                                        <p class="price">${element.price} دينار أردني</p>
                                    </div>
                                </div>
                            </div>
                `;
        });

        updatePagination(data.page, data.totalPages);
    }
    else {
        console.log('Error occurred');
    }

}

function updatePagination(currentPage, totalPages) {
    debugger
    const paginationContainer = document.querySelector('.unique-pagination');
    paginationContainer.innerHTML = '';  // Clear existing pagination links

    if (currentPage > 1) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="productsListAndFilters(productsFilters.categoryName, productsFilters.subCategoryName, ${currentPage - 1})">«</a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="productsListAndFilters(productsFilters.categoryName, productsFilters.subCategoryName, ${i})">${i}</a></li>`;
    }

    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="productsListAndFilters(productsFilters.categoryName, productsFilters.subCategoryName, ${currentPage + 1})">»</a></li>`;
    }
}

productsListAndFilters()

/////////////////////////////////////////////////////////////////////// go to details page

async function checkDetailes(id) {

    localStorage.setItem("ProId", id);

}

///////////////////////////////////

function clearBusinessSelection() {
    document.querySelectorAll('input[name="businessName"]').forEach(radio => {
        radio.checked = false;
    });
    productsFilters.businessName = "";
    productsListAndFilters()
}

function clearGovernateSelection() {
    document.querySelectorAll('input[name="businessGovernate"]').forEach(radio => {
        radio.checked = false;
    });
    productsFilters.businessGovernate = "";
    productsListAndFilters()
}







////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////// fill list 
// debugger
// let typeFilter = localStorage.getItem("ProType");

// if (typeFilter == null) {
//     var fillUrl = 'https://localhost:7158/api/Products/getAll';
// }
// else {
//     var fillUrl = `https://localhost:7158/api/Products/getProByType/${typeFilter}`;
// }


// async function fill() {
//     // debugger
//     let response = await fetch(fillUrl);
//     let data = await response.json();
//     // console.log(data);

//     const container = document.getElementById("productListCardsContainer");
//     container.innerHTML = ""

//     data.forEach(element => {
//         container.innerHTML += `
//         <div class="col-md-4">
//                         <div class="card mb-4 product-card">
//                             <div class="pro-img-box">
//                                 <img src="../../images/${element.image}" class="img-fluid"
//                                     alt="" />

//                                 <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
//                                     <i class="fa fa-info-circle"></i>
//                                 </a>
//                             </div>
//                             <div class="card-body text-center">
//                                 <h4>${element.name}</h4>
//                                 <p class="Desc">${element.description}</p>
//                                 <p class="price">${element.price} دينار أردني</p>
//                             </div>
//                         </div>
//                     </div>
//         `;
//     });
// }
// localStorage.removeItem("ProType");
// fill();


///////////////////////////////////// fill list categories

// async function CatList(CatName, SubCatName) {
//     const url = `https://localhost:7158/api/Products/getProByCat/${CatName}/${SubCatName}`;
//     let response = await fetch(url);
//     let data = await response.json();

//     const container = document.getElementById("productListCardsContainer");
//     container.innerHTML = ""
//     data.forEach(element => {
//         container.innerHTML += `
//         <div class="col-md-4">
//                         <div class="card mb-4 product-card">
//                             <div class="pro-img-box">
//                                 <img src="../../images/${element.image}" class="img-fluid"
//                                     alt="" />

//                                 <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
//                                     <i class="fa fa-info-circle"></i>
//                                 </a>
//                             </div>
//                             <div class="card-body text-center">
//                                 <h4>${element.name}</h4>
//                                 <p class="Desc">${element.description}</p>
//                                 <p class="price">${element.price} دينار أردني</p>
//                             </div>
//                         </div>
//                     </div>
//         `;
//     });
// }


// async function GenList(CatName) {
//     const url = `https://localhost:7158/api/Products/getProByCat/${CatName}`;
//     let response = await fetch(url);
//     let data = await response.json();
//     const container = document.getElementById("productListCardsContainer");
//     container.innerHTML = ""
//     data.forEach(element => {
//         container.innerHTML += `
//         <div class="col-md-4">
//                         <div class="card mb-4 product-card">
//                             <div class="pro-img-box">
//                                 <img src="../../images/${element.image}" class="img-fluid"
//                                     alt="" />

//                                 <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
//                                     <i class="fa fa-info-circle"></i>
//                                 </a>

//                             </div>
//                             <div class="card-body text-center">
//                                 <h4>${element.name}</h4>
//                                 <p class="Desc">${element.description}</p>
//                                 <p class="price">${element.price} دينار أردني</p>
//                             </div>
//                         </div>
//                     </div>
//         `;
//     });
// }


/////////////price filter


// async function filterProducts(minPrice, maxPrice) {
//     const url = `https://localhost:7158/api/Products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`;

//     const response = await fetch(url);
//     let data = await response.json();

//     const productContainer = document.getElementById("productListCardsContainer");
//     productContainer.innerHTML = '';

//     data.forEach(element => {
//         productContainer.innerHTML += `
//                     <div class="col-md-4">
//                         <div class="card mb-4 product-card">
//                             <div class="pro-img-box">
//                                 <img src="../../images/${element.image}" class="img-fluid" alt="${element.name}" />

//                                 <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})" >
//                                     <i class="fa fa-info-circle"></i>
//                                 </a>
//                             </div>
//                             <div class="card-body text-center">
//                                 <h4>${element.name}</h4>
//                                 <p class="Desc">${element.description}</p>
//                                 <p class="price">${element.price} دينار أردني</p>
//                             </div>
//                         </div>
//                     </div>
//         `;
//     });
// }




///////////////////////////////////////////////// color filter


// async function colorFilter() {
//     debugger
//     const checkboxes = document.querySelectorAll('.color-checkbox');

//     let selectedColors = Array.from(checkboxes)
//         .filter(checkbox => checkbox.checked)
//         .map(checkbox => checkbox.value);

//     // console.log("Selected colors:", selectedColors);

//     if (selectedColors.length > 0) {
//         const url = `https://localhost:7158/api/Products/getProByColor?${selectedColors.map(color => `color=${color}`).join('&')}`;


//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         // console.log("Fetched data:", data);

//         const container = document.getElementById("productListCardsContainer");
//         container.innerHTML = "";

//         if (data.length === 0) {
//             container.innerHTML = '<p>No products found for the selected colors.</p>';
//             return;
//         }

//         data.forEach(element => {
//             container.innerHTML += `
//                     <div class="col-md-4">
//                         <div class="card mb-4 product-card">
//                             <div class="pro-img-box">
//                                 <img src="../../images/${element.image}" class="img-fluid" alt="${element.name}" />

//                                 <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
//                                     <i class="fa fa-info-circle"></i>
//                                 </a>

//                             </div>
//                             <div class="card-body text-center">
//                                 <h4>${element.name}</h4>
//                                 <p class="Desc">${element.description}</p>
//                                 <p class="price">${element.price} دينار أردني</p>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//         });
//     } else {
//         fill(); // Fetch all products and display them
//     }
// }


////////////////////////////////////////////// search function


// async function SearchName() {
//     let searchText = document.getElementById("nameSearch").value;

//     if (searchText == "" || searchText == null) {
//         fill();
//         return;
//     }

//     const url = `https://localhost:7158/api/Products/textSearch?text=${searchText}`;
//     try {
//         let response = await fetch(url);

//         if (response.status === 404) {
//             const container = document.getElementById("productListCardsContainer");
//             container.innerHTML = `<h3>لا يوجد أي منتج يطابق البحث.</h3>
//             <p>الرجاء توسعة نطاق البحث</p>`;
//             return;
//         }

//         let data = await response.json();

//         const container = document.getElementById("productListCardsContainer");
//         container.innerHTML = "";

//         data.forEach(element => {
//             container.innerHTML += `
//             <div class="col-md-4">
//                 <div class="card mb-4 product-card">
//                     <div class="pro-img-box">
//                         <img src="../../images/${element.image}" class="img-fluid" alt="" />
//                         <a href="ProductDetails.html" class="view-details" onclick="checkDetailes(${element.id})">
//                             <i class="fa fa-info-circle"></i>
//                         </a>
//                     </div>
//                     <div class="card-body text-center">
//                         <h4>${element.name}</h4>
//                         <p class="Desc">${element.description}</p>
//                         <p class="price">${element.price} دينار أردني</p>
//                     </div>
//                 </div>
//             </div>
//             `;
//         });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//     }
// }


///////////////////////////////////////////////////////////////// add cart item to local

// async function addToCartFromList(id) {
//     // debugger
//     const quantity = document.getElementById("productQuantity") ? document.getElementById("productQuantity").value : 1;

//     const colorOption = document.querySelector('input[name="color"]:checked');
//     let color = colorOption ? colorOption.value : null;
//     // console.log(color);

//     const token = localStorage.getItem("jwtToken");

//     if (!token) {

//         const url = `https://localhost:7158/api/ProductsDetails/DetailByProId/${id}`
//         const response = await fetch(url);
//         let proDetails = await response.json();

//         localStorage.setItem(`item${id}`, JSON.stringify({
//             productId: Number(id),
//             quantity: Number(quantity),
//             color: color,
//             price: proDetails.price,
//             name: proDetails.name,
//             image: proDetails.image
//         })
//         );
//         // console.log(localStorage.getItem(`item${ProId}`));

//         Swal.fire({
//             icon: "success",
//             title: "لقد تمت إضافة المنتج إلى العربة بنجاح",
//             showConfirmButton: false,
//             timer: 1000,
//             showClass: {
//                 popup: `
//         animate__animated
//         animate__fadeInUp
//         animate__faster
//       `
//             },
//             hideClass: {
//                 popup: `
//         animate__animated
//         animate__fadeOutDown
//         animate__faster
//       `
//             }
//         });

//     }
//     else {

//         const userId = localStorage.getItem('userId');
//         const url = `https://localhost:7158/api/CartAndOrder/addCartItems/${userId}`;

//         const response = await fetch(url,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     productId: Number(id),
//                     quantity: Number(quantity),
//                     color: color,
//                 })
//             }
//         );

//         if (response.ok) {
//             Swal.fire({
//                 icon: "success",
//                 title: "لقد تمت إضافة المنتج إلى العربة بنجاح",
//                 showConfirmButton: false,
//                 timer: 1000,
//                 showClass: {
//                     popup: `
//             animate__animated
//             animate__fadeInUp
//             animate__faster
//           `
//                 },
//                 hideClass: {
//                     popup: `
//             animate__animated
//             animate__fadeOutDown
//             animate__faster
//           `
//                 }
//             });
//         }
//         else {
//             Swal.fire({
//                 icon: "error",
//                 // title: "",
//                 text: "يبدو أن هنالك خطا ما",
//                 footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>'
//             });
//         }


//     }



// }




{/* <a href="#" class="add-to-cart">
<i class="fa fa-shopping-cart" onclick="addToCartFromList(${element.id})"></i>
</a> */}


















