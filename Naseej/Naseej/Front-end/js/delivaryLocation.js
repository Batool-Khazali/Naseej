



/////////////////////////////////// city and governate dropdown
document.getElementById("userCity").addEventListener("change", () =>
{
    const city = document.getElementById("userCity");

    let Mgov = document.getElementsByClassName("l-m");
    let Igov = document.getElementsByClassName("l-i");

    switch (city.value)
    {
        case "المفرق":
            for (let i = 0; i < Mgov.length; i++) {
                Mgov[i].style.display = "block";
            }
            for (let i = 0; i < Mgov.length; i++) {
                Igov[i].style.display = "none";
            }
            break;

        case "اربد":
            for (let i = 0; i < Mgov.length; i++) {
                Mgov[i].style.display = "none";
            }
            for (let i = 0; i < Igov.length; i++) {
                Igov[i].style.display = "block";
            }
            break;

        default:
            for (let i = 0; i < Mgov.length; i++) {
                Mgov[i].style.display = "none";
            }
            for (let i = 0; i < Mgov.length; i++) {
                Mgov[i].style.display = "none";
            }
            break;
    }
});


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











