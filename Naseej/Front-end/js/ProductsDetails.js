
const ProId = localStorage.getItem('ProId');

document.addEventListener('DOMContentLoaded', () => {

  getDetails(ProId);
  ProductStoreDetails();


});





///////////////////////////// Product Quantity
function updateQuantity(action) {
  const input = document.getElementById("productQuantity");
  let oldValue = parseFloat(input.value);

  if (action === 'increase') {
    input.value = oldValue + 1;
  } else if (action === 'decrease') {
    input.value = oldValue > 1 ? oldValue - 1 : 1;
  }


  const stock = document.getElementById("ProductStock").innerText;
  // console.log(stock);

  if (Number(input.value) > Number(stock)) {
    document.getElementById("stockErrorMessage").innerHTML = `<p>الكمية المدخلة تتجاوز الكمية المتوفرة حاليا.</p>
                              <p>الكمية المتاحة: ${stock}.</p>`;
    document.getElementById("stockErrorMessage").style.display = "inline";
  }
  else {
    document.getElementById("stockErrorMessage").innerHTML = "";
    document.getElementById("stockErrorMessage").style.display = "none";
  }
}


///////////////////////products info details image slider

$(document).ready(function () {
  $('#lightSlider').lightSlider({
    item: 1,
    loop: true,
    slideMove: 1,
    slideMargin: 10,
    enableDrag: true,
    rtl: true, // This enables RTL mode for LightSlider
    currentPagerPosition: 'middle',
    pager: true,
    controls: true,
    auto: true,
    pause: 4000,
    speed: 1000,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          item: 1,
          slideMove: 1,
          slideMargin: 6,
        },
      },
      {
        breakpoint: 480,
        settings: {
          item: 1,
          slideMove: 1,
        },
      },
    ],
  });
});


///////////////////////////////////////// product details



async function getDetails(proId) {

  const ProUrl = `https://localhost:7158/api/ProductsDetails/DetailByProId/${proId}`;

  const respone1 = await fetch(ProUrl);
  if (respone1.status === 404) {
    const container = document.getElementById("ContentContainer");
    container.innerHTML = `<h1>لا يوجد منتج مطابق</h1>`;
    return;
  }

  let ProData = await respone1.json();


  //////name
  const crump = document.getElementById("proNameCrump");
  crump.innerHTML = ProData.name;

  const title = document.getElementById("titleName");
  title.innerHTML += ProData.name;

  const name = document.getElementById("ProductDetailsName");
  name.innerHTML = ProData.name;

  const name2 = document.getElementById("ProName");
  name2.innerHTML += ProData.name;

  //////////images
  let carouselImages = document.getElementsByClassName(" ProCarouselImg");

  carouselImages[0].src = `../../images/${ProData.image}`;
  carouselImages[1].src = `../../images/${ProData.image2}`;
  carouselImages[2].src = `../../images/${ProData.image3}`;
  carouselImages[3].src = `../../images/${ProData.image4}`;

  let tumbnailImages = document.getElementsByClassName("img-thumbnail thumbnail-img");

  tumbnailImages[0].src = `../../images/${ProData.image}`;
  tumbnailImages[1].src = `../../images/${ProData.image2}`;
  tumbnailImages[2].src = `../../images/${ProData.image3}`;
  tumbnailImages[3].src = `../../images/${ProData.image4}`;

  ////////////////// price
  const price = document.getElementById("ProductPrice");
  price.innerHTML += ProData.price;

  ////////////////// description
  const description = document.getElementById("ProductDestcription");
  description.innerHTML += ProData.description;


  ////////////////// colors 
  ProData.color.forEach(element => {
    const colors = document.getElementById("ProductColorsOptions");

    colors.innerHTML += `
            <label for="${element}">
            <input type="radio" class="form-check-input d-none" id="${element}" value="${element}" name="color" required>
            <span class="color-option" style="background-color: ${element};"></span>
        </label>
    `;
  });

  ////////////////// Product Category
  const category = document.getElementById("ProCatType");
  category.innerHTML += ProData.c.name + " - " + ProData.c.subCategory


  //////////////// stock
  const stock = document.getElementById("ProductStock");
  const stock2 = document.getElementById("ProStock");
  stock.innerHTML += ProData.stock;
  stock2.innerHTML += ProData.stock;

  ///////////////// care
  const care = document.getElementById("ProCare");
  care.innerHTML += ProData.c.care;

  //////////////// usage
  const usage = document.getElementById("ProUse");
  usage.innerHTML += ProData.c.usage;


}





///////////////////////////////// product store details

async function ProductStoreDetails() {
  // debugger
  const url = `https://localhost:7158/api/ProductsDetails/ProductStoreDetails/${ProId}`
  const respone = await fetch(url);
  let data = await respone.json();

  const storeName = document.getElementById("StoreName");
  const proStore = document.getElementById("ProStore");

  storeName.innerHTML += data.name;
  proStore.innerHTML += data.name + " ( " + data.city + " - " + data.governate + " - " + data.address + " )";


}


/// stop it from going to 0
let quantity = document.getElementById("productQuantity");

quantity.addEventListener('change', (event) => {
  if (event.target.value <= 0) {
    event.target.value = 1;
  }


  const stock = document.getElementById("ProductStock").innerText;
  // console.log(stock);

  if (Number(event.target.value) > Number(stock)) {
    document.getElementById("stockErrorMessage").innerHTML = `<p>الكمية المدخلة تتجاوز الكمية المتوفرة حاليا.</p>
                              <p>الكمية المتاحة: ${stock}.</p>`;
    document.getElementById("stockErrorMessage").style.display = "inline";
  } else {
    document.getElementById("stockErrorMessage").innerHTML = "";
    document.getElementById("stockErrorMessage").style.display = "none";
  }

});


//////////////////////////////////////////////// add to cartItems table

async function addToCart() {
  // debugger
  const quantity = document.getElementById("productQuantity") ? document.getElementById("productQuantity").value : 1;

  if (quantity <= 0) {
    quantity = 1;
  }

  const colorOption = document.querySelector('input[name="color"]:checked');

  if (!colorOption) {
    const colorMessage = document.getElementById("colorErrorMessage");
    colorMessage.innerHTML = "الرجاء اخيار اللون";
    colorMessage.style.display = "inline";
    colorMessage.style.color = "red";
    return;
  }

  let color = colorOption ? colorOption.value : null;
  // console.log(color);

  const token = localStorage.getItem("jwtToken");

  if (!token) {

    const url = `https://localhost:7158/api/ProductsDetails/DetailByProId/${ProId}`
    const response = await fetch(url);
    let proDetails = await response.json();

    const existingProduct = localStorage.getItem(`item${ProId}`);

    if (existingProduct) {
      let existingItem = JSON.parse(existingProduct);
      existingItem.quantity += Number(quantity);
      localStorage.setItem(`item${ProId}`, JSON.stringify(existingItem));
    }
    else {
      localStorage.setItem(`item${ProId}`, JSON.stringify({
        productId: Number(ProId),
        quantity: Number(quantity),
        color: color,
        price: proDetails.price,
        name: proDetails.name,
        image: proDetails.image
      })
      );
    }


    // console.log(localStorage.getItem(`item${ProId}`));

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

  }
  else {

    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/CartAndOrder/addCartItems/${userId}`;

    const response = await fetch(url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: Number(ProId),
          quantity: Number(quantity),
          color: color,
        })
      }
    );

    if (response.ok) {
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
    }
    else {
      Swal.fire({
        icon: "error",
        title: "يبدو أن هنالك خطأ ما",
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


  }
}




/////////////////////////////////////// go to cart

function goToCart() {
  window.location.href = "Cart.html";
}






