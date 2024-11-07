
const catId = localStorage.getItem("AdminCatID")

document.addEventListener('DOMContentLoaded',() =>{

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
    debugger

    const url = `https://localhost:7158/api/AdminCategories/editCategory/${catId}`;

    let form = document.getElementById("editCategoryForm");
    let formData = new FormData(form);

    const response = await fetch(url, {
        method: 'PUT',
        body: formData,
    } );

    if (response.ok) {
        alert("Category edited successfully!");
        window.location.href = "categories.html";
    } else {
        alert("Failed to edit category. Please try again.");
    }



}














