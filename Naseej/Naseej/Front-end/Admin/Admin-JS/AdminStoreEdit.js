const storeId = localStorage.getItem('AdminStoreId');

document.addEventListener('DOMContentLoaded', function () {

    getStoreInfo();

});



//////////////////////////// edit info

async function edit() {
    // debugger

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


///////////////////// get store info

async function getStoreInfo() {

    const url = `https://localhost:7158/api/AdminStores/getStoresById/${storeId}`
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {

        let OpenTime = data.openHour ? data.openHour.split('.')[0] : null;
        let OpenTimeFormat = convertTo24HourFormat(OpenTime);

        let CloseTime = data.closeHour ? data.closeHour.split('.')[0] : null;
        let CloseTimeFormat = convertTo24HourFormat(CloseTime);

        document.getElementById('simpleinput').value = data.name;
        document.getElementById('example-email').value = data.phone;
        document.getElementById('example-select').value = data.specialty;
        document.getElementById('example-City').value = data.city;
        document.getElementById('example-readonly').value = data.governate;
        document.getElementById('example-textarea').value = data.adress;
        document.getElementById('example-desc').value = data.description;
        document.getElementById('open-time').value = OpenTimeFormat;
        document.getElementById('close-time').value = CloseTimeFormat;
    }
}

// to convert from db to js time format of 24hour
function convertTo24HourFormat(timeStr) {

    if (!timeStr) {
        return '';
    }
    
    const [time, modifier] = timeStr.split(' '); // Split the time and AM/PM part
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}












