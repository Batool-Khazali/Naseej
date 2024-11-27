
const admin = localStorage.getItem('isAdmin');


const catId = localStorage.getItem("AdminCatID")

document.addEventListener('DOMContentLoaded',() =>{
    
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
    getCategoryInfo()


});


//////////////////////////////////  get values

async function getCategoryInfo() {

    const url = `https://localhost:7158/api/AdminCategories/getCatDetails/${catId}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        document.getElementById('name').value = data.name;
        document.getElementById('subName').value = data.subCategory;
        document.getElementById('Usage').value = data.usage;
        document.getElementById('Care').value = data.care;
        document.getElementById('Description').value = data.description;
        document.getElementById('imagePreview').src += data.image;
    }

}


//////////////////////////////////// edit form

async function editCat(event) {

    event.preventDefault();
    // debugger

    const url = `https://localhost:7158/api/AdminCategories/editCategory/${catId}`;

    let form = document.getElementById("editCategoryForm");
    let formData = new FormData(form);

    const response = await fetch(url, {
        method: 'PUT',
        body: formData,
    } );

    if (response.ok) {
        Swal.fire({
            title: "Success",
            text: "Category has been edited successfully!",
            icon: "success",
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
            location.href = "Categories.html"; 
          }, 3000);

    } else {
        Swal.fire({
            title: "Error",
            text: "Failed to edit category. Please try again.",
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
          });    }



}














