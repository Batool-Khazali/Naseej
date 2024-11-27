async function getLatest() {

    const url = "https://localhost:7158/api/Products/getLatestProduct";
    console.log("Fetching data from:", url);

    const response = await fetch(url);

    if (!response.ok) {
        Swal.fire({
            icon: "error",
            title: "يبدو أن هنالك خطأ ما في استرجاع المعلومات",
            footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>',
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

    const data = await response.json();
    console.log('Fetched Data:', data);

    const container = document.getElementById("latestSliderCardCon");
    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = "<p>No products available at the moment.</p>";
        return;
    }

    data.forEach(product => {
        const productHtml = `
                <li class="splide__slide">
                    <div class="product-card">
                        <div class="product-tumb">
                            <img src="../images/${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-details">
                            <span class="product-catagory">${product.categoryName}</span>
                            <h4>
                                <a href="html/ProductDetails.html" onclick="checkDetailes(${product.id})">
                                    ${product.name}
                                </a>
                            </h4>
                            <p>${product.description}</p>
                            <div class="product-bottom-details">
                                <div class="product-links">
                                    <p style="visibility: hidden;"></p>
                                </div>
                                <div class="product-price">${product.price} د.أ</div>
                            </div>
                        </div>
                    </div>
                </li>
            `;

    });

    // console.log("Slides added");

    // Initialize the Splide slider with specific settings
    const splide = new Splide('#product-slider-1', {
        type: 'loop',
        perPage: 5,
        gap: '10px',
        direction: 'rtl',
        breakpoints: {
            1400: {
                perPage: 4,
            },
            1200: {
                perPage: 3,
            },
            1024: {
                perPage: 2,
            },
            600: {
                perPage: 2,
            },
        },
    }).mount();


}
getLatest();





async function getMostSold() {

    const url = "https://localhost:7158/api/Products/getMostSold";
    console.log("Fetching data from:", url);

    const response = await fetch(url);

    if (!response.ok) {
        Swal.fire({
            icon: "error",
            title: "يبدو أن هنالك خطأ ما في استرجاع المعلومات",
            footer: '<a href="ContactUs.html">تواصل معنا في حال استمرار الخطأ</a>',
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

    const data = await response.json();
    console.log('Fetched Data:', data);

    const container = document.getElementById("mostSoldSliderCardCon");
    container.innerHTML = ""; 

    if (data.length === 0) {
        console.log("No products found.");
        container.innerHTML = "<p>No products available at the moment.</p>";
        return;
    }

    data.forEach(product => {
        const productHtml = `
                <li class="splide__slide">
                    <div class="product-card">
                        <div class="badge">Hot</div>
                        <div class="product-tumb">
                            <img src="../images/${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-details">
                            <span class="product-catagory">${product.categoryName}</span>
                            <h4>
                                <a href="html/ProductDetails.html" onclick="checkDetailes(${product.id})">
                                    ${product.name}
                                </a>
                            </h4>
                            <p>${product.description}</p>
                            <div class="product-bottom-details">
                                <div class="product-price">${product.price} د.أ</div>
                            </div>
                        </div>
                    </div>
                </li>
            `;
    });

    // console.log("Slides added");

    // Initialize the Splide slider for most sold products
    const splide = new Splide('#product-slider-2', {
        type: 'loop',
        perPage: 5,
        gap: '10px',
        direction: 'rtl',
        breakpoints: {
            1400: {
                perPage: 4,
            },
            1200: {
                perPage: 3,
            },
            1024: {
                perPage: 2,
            },
            600: {
                perPage: 1,
            },
        },
    }).mount();


}
getMostSold();





function checkDetailes(id) {
    localStorage.setItem('ProId', id);
    location.href = "html/ProductDetails.html"
}




