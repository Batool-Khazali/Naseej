document.addEventListener("DOMContentLoaded", function () {

});

///////////////////////// fill speciality select input
function fillSpecialitySelect() {
    const typeSelect = document.getElementById("bussinessType");
    const select = document.getElementById("specialty");

    switch (typeSelect.value) {
        case "shop":
            document.getElementById("1-1").style.display = "block";
            document.getElementById("1-2").style.display = "block";
            document.getElementById("2-1").style.display = "none";
            document.getElementById("2-2").style.display = "none";
            document.getElementById("3-1").style.display = "none";
            document.getElementById("3-2").style.display = "none";
            break;
        case "tailor":
            document.getElementById("1-1").style.display = "none";
            document.getElementById("1-2").style.display = "none";
            document.getElementById("2-1").style.display = "block";
            document.getElementById("2-2").style.display = "block";
            document.getElementById("3-1").style.display = "none";
            document.getElementById("3-2").style.display = "none";
            break;
        case "craft":
            document.getElementById("1-1").style.display = "none";
            document.getElementById("1-2").style.display = "none";
            document.getElementById("2-1").style.display = "none";
            document.getElementById("2-2").style.display = "none";
            document.getElementById("3-1").style.display = "block";
            document.getElementById("3-2").style.display = "block";
            break;
        case "":
            select.disabled = true;
            break;
        default:
            select.disabled = true;
            break;
    }
}



/////////////////////////////////// city and governate dropdown
document.getElementById("city").addEventListener("change", () =>
    {
        const city = document.getElementById("city");
    
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
    
    



///////////////////// submit store
async function submitStoreForm() {
    debugger
    event.preventDefault();
    
    
    const userId = localStorage.getItem("userId");
    const apiUrl = `https://localhost:7158/api/Business/BusinessRequest/${userId}`;
    const form = document.getElementById("NewBusiness");

    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(`Error: ${errorMessage}`);
        throw new Error(`Error: ${errorMessage}`);

    }

    const result = await response.json();
    console.log(result);


}

















