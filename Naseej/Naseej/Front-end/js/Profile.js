


const UserId = localStorage.getItem('userId');

async function FillUserInfo(UserId) {
    debugger
    const url = `https://localhost:7158/api/Profile/getUserInfo/${UserId}`;
    const response = await fetch(url);
    let Data = await response.json();



    ////////// user image
    let ImgSrc = document.getElementById("UserImage");

    console.log(`${Data.image}`)
    console.log(`${Data.name}`)

    if (Data.image) {
        ImgSrc.src = "";
        ImgSrc.src = `../../images/${Data.image}`;
    }
    else {
        ImgSrc.src = "";
        ImgSrc.src = "../images/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg";
    }



    ////////////////// user name
    let name = document.getElementById("UserName");
    name.innerHTML = `${Data.name}`;

    let UserName = document.getElementById("TabUserName");
    UserName.innerHTML = `${Data.name}`;



    /////////////////////// age
    const Age = document.getElementById("TabUserAge");


    if (Data.birthDay) {
        // Convert the DateOnly format to a JavaScript Date object
        let birthDate = new Date(Data.birthDay);

        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDifference = today.getMonth() - birthDate.getMonth();

        // Adjust the age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        Age.innerHTML = `${age} سنة`;
    }
    else
    {
        Age.innerHTML = "لم يتم ادخال العمر بعد";
    }



    //////////////////////////// email
    const email = document.getElementById("TabUserEmail");
    email.innerHTML = `${Data.email}`;



    /////////////////////////// phone
    const phone = document.getElementById("TabUserPhone");

    if (Data.phone)
    {
        phone.innerHTML = `${Data.phone}`;
    }
    else
    {
        phone.innerHTML = "لم يتم ادخال الهاتف بعد";
    }



    /////////////////////////// address
    const address = document.getElementById("TabUserAddress");
    if (Data.address)
    {
        address.innerHTML = `${Data.city} - ${Data.governate} - ${Data.address}`;
    }
    else
    {
        address.innerHTML = "لم يتم ادخال العنوان بعد";
    }

}
FillUserInfo(UserId);

//////////////////////// profile edit

