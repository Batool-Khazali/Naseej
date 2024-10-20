


const storeId = localStorage.getItem('storeId');

async function edit() {
    debugger
    
    const url = `https://localhost:7158/api/AdminStores/editStoreInfo/${storeId}`
    const form = document.getElementById("editStore");
    let formaData = new FormData(form);
    const response = await fetch(url, {
        method: 'PUT',
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        body: formaData
    });

    if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "store info updated",
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
        window.location.href = "AdminStores.html";
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Error",
        });
    }


}
















