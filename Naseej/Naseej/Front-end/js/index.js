async function getLatest() {
    try {
        const url = "https://localhost:7158/api/Products/getLatestProduct";
        console.log("Fetching data from:", url);

        const response = await fetch(url);
        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        const container = document.getElementById("latestSliderCardCon");

        if (!container) {
            console.error("Container element with ID 'latestSliderCardCon' not found.");
            return;
        }

        container.innerHTML = ""; // Clear existing content

        // Check if the API returned more than one product
        if (data.length === 0) {
            console.log("No products found.");
            container.innerHTML = "<p>No products available at the moment.</p>";
            return;
        }

        // Loop through the fetched data and create a slide for each product
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
            // Use insertAdjacentHTML for better performance
            container.insertAdjacentHTML('beforeend', productHtml);
        });

        console.log("Slides added to the container.");

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

    } catch (error) {
        console.error('Error fetching latest products:', error);
    }
}

// Call the function to load the latest products when the script runs
getLatest();





async function getMostSold() {
    try {
        const url = "https://localhost:7158/api/Products/getMostSold";
        console.log("Fetching data from:", url);

        const response = await fetch(url);
        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        const container = document.getElementById("mostSoldSliderCardCon");

        if (!container) {
            console.error("Container element with ID 'mostSoldSliderCardCon' not found.");
            return;
        }

        container.innerHTML = ""; // Clear existing content

        // Check if the API returned any products
        if (data.length === 0) {
            console.log("No products found.");
            container.innerHTML = "<p>No products available at the moment.</p>";
            return;
        }

        // Loop through the fetched data and create a slide for each product
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
            // Use insertAdjacentHTML for better performance
            container.insertAdjacentHTML('beforeend', productHtml);
        });

        console.log("Slides added to the container.");

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

    } catch (error) {
        console.error('Error fetching most sold products:', error);
    }
}

// Call the function to load the most sold products when the script runs
getMostSold();





function checkDetailes(id) {
    localStorage.setItem('ProId', id);
    location.href = "html/ProductDetails.html"
}




