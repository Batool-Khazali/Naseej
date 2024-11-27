const storeId = localStorage.getItem('AdminStoreId');

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

    getStoreInfo();

});


///////////////////// get store info

async function getStoreInfo() {

    // debugger
    const url = `https://localhost:7158/api/AdminStores/getStoresById/${storeId}`
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {

        localStorage.setItem('storeName', data.name); // for the delete

        let OpenTime = data.openHour ? data.openHour.split('.')[0] : null;
        let OpenTimeFormat = convertTo24HourFormat(OpenTime);

        let CloseTime = data.closeHour ? data.closeHour.split('.')[0] : null;
        let CloseTimeFormat = convertTo24HourFormat(CloseTime);

        document.getElementById('storeName').innerHTML = data.name;
        document.getElementById('storePhone').innerHTML = `0${data.phone}`;
        document.getElementById('storeSpeciality').innerHTML = data.specialty;
        document.getElementById('storeLocation').innerHTML = `${data.city} - ${data.governate}`;
        document.getElementById('storeAddress').innerHTML = data.adress;
        document.getElementById('storeDesc').innerHTML = data.description;
        document.getElementById('storeHours').innerHTML = `${OpenTimeFormat} - ${CloseTimeFormat}`;
        document.getElementById('storeImage').src = `../../logo/${data.logo}`;
        document.getElementById('storeOwner').innerHTML = data.so.name;
        debugger
        document.getElementById('permitViewer').src += data.storePermit;

        if (data.status == "pending") {
            document.getElementById('acceptBTN').style.display = "inline"
            document.getElementById('rejectBTN').style.display = "inline"
        }
        else if (data.status === "acceptd") 
        {
            document.getElementById('acceptedMark').style.display = "inline"
        }
        else if (data.status === "refused") {
            document.getElementById('refusedMark').style.display = "inline"
        }

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



/////////////////////////////////////viewPermit

function showPermit() {

    const image = document.getElementById("permitViewer");

    image.style.display = "inline";

}


////////////////////////// accept/reject store

async function acceptOrRejectStore(status) {
    let storeName = localStorage.getItem('storeName');

    Swal.fire({
        title: "Are you sure?",
        text: `the store ${storeName} will be ${status}!`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed with it!"
    }).then((result) => {
        if (result.isConfirmed) {

            debugger
            //////////// update status
            async function action() {
                const url = `https://localhost:7158/api/AdminStores/acceptStore/${storeId}?status=${status}`;
                const response = await fetch(url, {
                    method: 'PUT'
                });

                if (response.ok) {
                    getStoreInfo();
                    
                    Swal.fire({
                        title: "Updated!",
                        text: `the store ${storeName} has been ${status}`,
                        icon: "success"
                    });

                    location.reload();
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: `There has been an error while updating ${storeName} status to ${status}`,
                        icon: "error"
                    });
                }

            }
            action();
        }
    });

}

