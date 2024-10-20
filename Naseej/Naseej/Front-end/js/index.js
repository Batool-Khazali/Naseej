

// async function getLatest() {
//     // debugger
//     const url = "https://localhost:7158/api/Products/getLatestProduct"
//     const response = await fetch(url);
//     const data = await response.json();

//     const container = document.getElementById("latestSliderCardCon");
//     container.innerHTML = "";

//     data.forEach(product => {
//         container.innerHTML += `
//                                 <li class="splide__slide">
//                             <div class="product-card">
//                                 <div class="product-tumb">
//                                     <img src="../images/${product.image}"
//                                         alt="${product.name}">
//                                 </div>
//                                 <div class="product-details">
//                                     <span class="product-catagory">${product.description}</span>
//                                     <h4><a href="html/ProductDetails.html" onclick="checkDetailes(${product.id})">${product.name}</a></h4>
//                                     <p>${product.description}</p>
//                                     <div class="product-bottom-details">
//                                         <div class="product-links">
//                                             <p style="visibility: hidden;"></p>
//                                         </div>
//                                         <div class="product-price">${product.price}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </li>
//         `
//     })
// }

// getLatest();






