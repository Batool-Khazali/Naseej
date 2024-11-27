const productId = localStorage.getItem('AdminProID');

const admin = localStorage.getItem('isAdmin');


document.addEventListener('DOMContentLoaded', function () {
    if (!admin) {
      Swal.fire({
        title: "Error",
        text: "You are not authorized to access this page.",
        icon: "error",
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
      

      setTimeout(function () {
        location.href = "../index.html";
      }, 3000);
      
    }

    getProductInfo();

});


///////////////////// get store info

async function getProductInfo() {

    // debugger
    const url = `https://localhost:7158/api/AdminProducts/getProductDetails/${productId}`
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {

        localStorage.setItem('productName', data.productName); // for the delete

        document.getElementById('productImage1').src = `../../images/${data.productImage}`;
        document.getElementById('productImage2').src = `../../images/${data.productImage2}`;
        document.getElementById('productImage3').src = `../../images/${data.productImage3}`;
        document.getElementById('productImage4').src = `../../images/${data.productImage4}`;
        document.getElementById('productName').innerHTML = data.productName;

        document.getElementById('type').innerHTML = data.productType;
        document.getElementById('category').innerHTML =  `${data.categoryName} - ${data.subCategory}`;

        document.getElementById('colors').innerHTML =  `${data.color.split(',').map(color => `
                                                            <span class="color-circle" style="background-color: ${color.trim()};"></span>
                                                        `).join('')}`;

        document.getElementById('desc').innerHTML = data.productDescription;

        document.getElementById('price').innerHTML = `${data.price} JOD`;
        document.getElementById('stock').innerHTML = `${data.stock} Left`;

        document.getElementById('store').innerHTML = data.businessName;
        document.getElementById('storeLocation').innerHTML = `${data.city} - ${data.adress}`;



    }
}


////////////////////////// delete

async function DeleteProduct() {

    const url = `https://localhost:7158/api/AdminProducts/DeleteProduct/${productId}`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        text: "Products in both Carts and Orders will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            async function deleteCat() {
                const response = await fetch(url, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fillTable()
                    Swal.fire({
                        title: "Deleted!",
                        text: "the product has been deleted.",
                        icon: "success"
                    });
                    location.href = "Products.html";
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: "an error occurred",
                        icon: "error"
                    });
                }

            }

            deleteCat();
        }
    });

}










