

const userId = localStorage.getItem('userId');


document.addEventListener('DOMContentLoaded', function()
{
    if (!userId){
        Swal.fire({
            title: "الرجاء تسجيل الدخول ",
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
    
          setTimeout(function() {
            location.href = "Login.html"; 
          }, 3000);
    }

    fillStoreProducts();
});

//////////////////////////////////////////////////////////////////

async function fillStoreProducts()
{

    const url = `https://localhost:7158/api/Store/StoreProducts/${userId}`;
    const response = await fetch(url);
    let data = await response.json();

    const proTableBody = document.getElementById("storeProductsTableBody");
    proTableBody.innerHTML = "";

    data.forEach(element => {

        proTableBody.innerHTML += `
                                    <tr>
                                <td><img src="../../images/${element.image}" alt="${element.name}"></td>
                                <td>${element.name}</td>
                                <td>${element.price}</td>
                                <td>${element.stock}</td>
                                <td>
                                            <a class="nav-link dropdown-bs-toggle text-muted pr-0" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="avatar avatar-sm mt-2">
              <i class="fa-solid fa-ellipsis" style="color: #452c16;"></i>
              </span>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="storeProductDetails.html" onclick="setStoProId(${element.id})">التفاصيل</a>
              <a class="dropdown-item" href="storeProductEdit.html" onclick="setStoProId(${element.id})">تعديل</a>
              <a class="dropdown-item"  onclick="deleteProduct(${element.id})">حذف</a>
            </div>
                                </td>
                            </tr>
        `;
    });


}


/////////////////////////////////////////////////// store product id

function setStoProId(id)
{
    localStorage.setItem('stoProId', id);
}



////////////////////////////////////////////////////////////// delete
async function deleteProduct(ProId) {
 
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

            window.location.reload();

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






