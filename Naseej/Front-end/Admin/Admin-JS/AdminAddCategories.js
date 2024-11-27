
const admin = localStorage.getItem('isAdmin');

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

////////////////////////////////////////////////

let radioButtons = document.querySelectorAll("input[name='categoryType']");

radioButtons.forEach(function (radio) {
  radio.addEventListener("change", function () {
    let categoryType = document.querySelector("input[name='categoryType']:checked");

    if (categoryType) {
      let categoryTypeValue = categoryType.value;
      // console.log(categoryTypeValue);

      switch (categoryTypeValue) {
        case "NewCategory":
          document.getElementById("newCategoryDiv").style.display = "flex";
          document.getElementById("oldCategoryDiv").style.display = "none";
          document.getElementById("Newname").disabled = false;
          break;
        case "ExistingCategory":
          document.getElementById("newCategoryDiv").style.display = "none";
          document.getElementById("oldCategoryDiv").style.display = "flex";
          document.getElementById("Oldname").disabled = false;

          break;
      }
    }
  });
});

async function fetchCategories() {

  const url = 'https://localhost:7158/api/Products/getCategoriesAndSubCategories';
  const response = await fetch(url);

  const data = await response.json();

  const selectElement = document.getElementById("Oldname");
  selectElement.innerHTML = '';

  data.categories.forEach(category => {
    selectElement.innerHTML += `
      <option value="${category}">
        ${category}
      </option>
    `;
  });
}
fetchCategories()

////////////////////////// add
async function addCat(event) {
  debugger
  event.preventDefault();

  const url = "https://localhost:7158/api/AdminCategories/addCategory";

  let form = document.getElementById("addCategoryForm");
  const formData = new FormData(form);

  const response = await fetch(url,
    {
      method: "POST",
      body: formData,
    });

  if (response.ok) {

    Swal.fire({
      title: "Success",
      text: "Category added successfully!",
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

  }
  else {
    Swal.fire({
      title: "Error",
      text: "Failed to add category. Please try again.",
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
  }


}




////////////////////////////
document.getElementById('categoryImage').addEventListener('change', function (event) {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const previewImage = document.getElementById('imagePreview');
          previewImage.src = e.target.result;
          document.getElementById("imagePreviewDiv").style.display = 'flex';
      };
      reader.readAsDataURL(file);
  }
});



