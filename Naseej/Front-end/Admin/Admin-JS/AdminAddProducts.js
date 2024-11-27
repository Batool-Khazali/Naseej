
const admin = localStorage.getItem('isAdmin');


document.addEventListener('DOMContentLoaded', () => {
    
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
    populateCategories()

    ////////////////////////// display images
    // Map input IDs to their corresponding preview image IDs
    const imagePreviewMap = {
        productImage: 'image1Preview',
        productImage2: 'image2Preview',
        productImage3: 'image3Preview',
        productImage4: 'image4Preview',
    };

    // Add change event listeners to all file inputs
    Object.keys(imagePreviewMap).forEach(inputId => {
        const fileInput = document.getElementById(inputId);
        const previewImage = document.getElementById(imagePreviewMap[inputId]);

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; // Get the selected file
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result; // Set preview image source
                };
                reader.readAsDataURL(file); // Read file as a data URL
            }
        });
    });
});

////////////////////////////////////

async function populateCategories(selectedCategoryId) {
    const url = 'https://localhost:7158/api/AdminProducts/getMainAndSubCategories';
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        const categorySelect = document.getElementById('categoryName');

        const combinedCategories = data.map(item => ({
            id: item.id,
            label: `${item.name} - ${item.subCategory}`
        }));

        // Populate the dropdown with the combined categories
        categorySelect.innerHTML = ''; // Clear existing options
        combinedCategories.forEach(category => {
            categorySelect.innerHTML += `
                <option value="${category.id}" ${category.id == selectedCategoryId ? 'selected' : ''}>
                    ${category.label}
                </option>
            `;
        });
    }
}

//////////////////////////// add

async function addNaseejPro(event) {

    event.preventDefault();

    // debugger
    const form = document.getElementById("addProductForm");
    const formData = new FormData(form);

    const checkboxes = document.querySelectorAll('.color-checkbox');
    const selectedColors = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const colorString = selectedColors.join(',');
    formData.append("color", colorString);

    formData.append("categoryId", document.getElementById("categoryName").value);

    const url = 'https://localhost:7158/api/AdminProducts/addSiteProducts';
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        Swal.fire({
            title: "Success",
            text: "Product added successfully!",
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
            location.href = "Products.html"; 
          }, 3000);
        
        } else {
            Swal.fire({
                title: "Error",
                text: "Failed to add product. Please try again.",
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


