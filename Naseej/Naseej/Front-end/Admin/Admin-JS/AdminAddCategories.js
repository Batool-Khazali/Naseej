

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
        const errorMessage = await response.text();
        console.error("Error adding category:", errorMessage);
    }


}








