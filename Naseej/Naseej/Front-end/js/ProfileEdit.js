
document.addEventListener('DOMContentLoaded', function () {
    fill();
});

////////////////////////// fill input with user data from DB
async function fill() {
    const userId = localStorage.getItem('userId');
    const url = `https://localhost:7158/api/Profile/getUserInfo/${userId}`;
    const response = await fetch(url);
    let data = await response.json();

    document.getElementById('userEmail').value = data.email;
    document.getElementById('userPhone').value = data.phone;
    document.getElementById('userFullName').value = data.name;
    document.getElementById('userAge').value = data.birthDay;
}





/////////////////////////// edit profile
async function updateProfile() {
    debugger
    const UserId = localStorage.getItem('userId');

    const url = `https://localhost:7158/api/Profile/updateUserProfile/${UserId}`;
    const form = document.getElementById("UserInfoEdit");

    const formData = new FormData(form);

    const userAgeInput = document.getElementById('userAge').value;
    if (userAgeInput) {
        const birthDate = new Date(userAgeInput);
        if (!isNaN(birthDate)) {
            formData.append('BirthDay', birthDate.toISOString().split('T')[0]); // YYYY-MM-DD
        } else {
            alert("Invalid date format");
            return;
        }
    } else {
        alert("Date of birth is required");
        return;
    }

    let response = await fetch(url,
        {
            method: 'PUT',
            body: formData
        }
    )

    if (response.ok) {
        window.location.href = "Profile.html";
    } else {
        // alert("Failed to update profile");
    }
}