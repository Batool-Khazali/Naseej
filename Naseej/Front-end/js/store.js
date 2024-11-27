
const userId = localStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', function()
{

    if (!userId){
        Swal.fire({
            title: "الرجاء تسجيل الدخول ",
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
    
          setTimeout(function() {
            location.href = "Login.html"; 
          }, 3000);
    }

    checkBusinessOwner();
});

///////////////////// check if business Owner

async function checkBusinessOwner()
{
    const url = `https://localhost:7158/api/Business/IsBusinessOwner/${userId}`
    const response = await fetch(url);
    let data = await response.json();
    // console.log(data, "Business Owner");

    if (data === true) {
        // Business owner
        document.getElementById('NotAStore').style.display = 'none';
        document.getElementById('AStore').style.display = 'block';
    } else {
        // Non-business owner
        document.getElementById('NotAStore').style.display = 'block';
        document.getElementById('AStore').style.display = 'none';
    }
}












