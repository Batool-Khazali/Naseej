

document.addEventListener('DOMContentLoaded', function()
{
    checkBusinessOwner();
});

///////////////////// check if business Owner

async function checkBusinessOwner()
{
    const userId = localStorage.getItem('userId');
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












