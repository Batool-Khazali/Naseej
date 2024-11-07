




///////////////////////////////// update locatiom

async function updateLocation()
{
    // debugger
    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/Profile/userLocation/${userId}`;

    const form = document.getElementById('UserLocation');
    const formData = new FormData(form);

    const response = await fetch(url, {
        method: 'PUT',
        body: formData,
    });
    
    if (response.ok) {
        location.href = "Profile.html";
    } else {
        Swal.fire({
            icon: "error",
            title: "يبدو أن هنالك خطأ ما",
        });
    }
}











