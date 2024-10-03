





// JavaScript function to switch images in the gallery
function showImage(index) {
    const images = document.querySelectorAll('.image-gallery img');
    images.forEach((img, idx) => {
        img.classList.remove('active');
        if (idx === index) {
            img.classList.add('active');
        }
    });
}


///////////////////////////////////////// get details

const ProId = localStorage.getItem('stoProId');

async function getDetails(proId) {
    debugger
    const ProUrl = `https://localhost:7158/api/ProductsDetails/DetailByProId/${proId}`;

    const respone = await fetch(ProUrl);
    if (respone.status === 404) {
        const container = document.getElementById("ContentContainer");
        container.innerHTML = `<h1>لا يوجد منتج مطابق</h1>`;
        return;
    }

    let ProData = await respone.json();


    //////name
    const name = document.getElementById("ProductDetailsName");
    name.innerHTML = ProData.name;

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
    price.innerHTML = ProData.price;

    ////////////////// description
    const description = document.getElementById("ProductDestcription");
    description.innerHTML += ProData.description;


    ////////////////// colors 
    const colors = document.getElementById("ProductColorsOptions");
    ProData.color.forEach(element => {

        colors.innerHTML += `
                        <div class="color-circle" style="background-color: ${element};"></div>
    `;
    });

    ////////////////// Product Category
    const category = document.getElementById("ProCatType");
    category.innerHTML += ProData.c.name + " - " + ProData.c.subCategory


    //////////////// stock
    const stock = document.getElementById("ProStock");
    stock.innerHTML += ProData.stock;

    ///////////////// care
    const care = document.getElementById("ProCare");
    care.innerHTML += ProData.c.care;

    //////////////// usage
    const usage = document.getElementById("ProUse");
    usage.innerHTML += ProData.c.usage;

}

getDetails(ProId);



///////////////////////////// delete

async function deleteProduct() {
    const userId = localStorage.getItem("userId");
    const url = `https://localhost:7158/api/Store/deleteProduct/${ProId}`;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "هل أنت متأكد؟",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم!",
        cancelButtonText: "لا!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: "تم الحذف!",
                text: "لقد تم حذف المنتج.",
                icon: "success"
            });

            // ///////////// delete functionality

            const response = fetch(url, {
                method: 'DELETE'
            });


        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "إلغاء الحذف",
                text: "لقد تم التراجع عن العملية",
                icon: "error"
            });

        }
    });[]

}














