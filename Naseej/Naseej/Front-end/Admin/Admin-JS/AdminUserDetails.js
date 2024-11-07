
let userId = localStorage.getItem('AdminUserID');

document.addEventListener('DOMContentLoaded',() => {  

    getUserInfo();

  })

/////////////////////////////////////// get user information

async function getUserInfo() {
    debugger

    const url = `https://localhost:7158/api/Profile/getUserInfo/${userId}`

    const response = await fetch(url);
    let userInfo = await response.json();

    if (response.ok) {

        ////// for age
        let birthDate = new Date(userInfo.birthDay);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDifference = today.getMonth() - birthDate.getMonth();
        // Adjust the age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }


        ////////// for business name
        console.log(userInfo.isBusinessOwner)
        if (userInfo.isBusinessOwner == true) {
            localStorage.setItem("AdminStoreId", userInfo.bussinessId)

            document.getElementById('userStoreBTN').style.display = "inline";

            document.getElementById('userBusinessName').style.display = "block";
            document.getElementById('userBusinessName').innerHTML = userInfo.bussinessName;
        } else {
            document.getElementById('userStoreBTN').style.display = "none";

            document.getElementById('userBusinessName').style.display = "block";
            document.getElementById('userBusinessName').innerHTML = "not a store owner";
        }



        document.getElementById('userImage').src += userInfo.image;
        document.getElementById('userName').innerHTML = userInfo.name;
        document.getElementById('userBirth').innerHTML = age + " years old ~ " + userInfo.birthDay;
        document.getElementById('userEmail').innerHTML = userInfo.email;
        document.getElementById('userPhone').innerHTML = userInfo.phone;
        document.getElementById('userAddress').innerHTML = `${userInfo.address} - ${userInfo.city} - ${userInfo.governate}`;
    }

}


///////////////////////////////////// buttons functions

function goToOrders() {

    window.location.href = "UserOrders.html";

}



function goToStore() {

    localStorage.getItem("AdminStoreId");

    window.location.href = "AdminStoreDetails.html";

}















