
///// format card number
document.getElementById('creditCardNumber').addEventListener('input', function (event) {
    this.value = this.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
});


///// format date
document.getElementById('expiryDate').addEventListener('input', function (event) {
    this.value = this.value.replace(/[^\d\/]/g, '').replace(/^(0[1-9]|1[0-2])$/, '$1/').replace(/\/\//g, '/');
});


////// get expired cards date
function checkExpiryDate(date) {
    const today = new Date();
    const monthYear = date.split('/');
    const expiryDate = new Date();
    expiryDate.setFullYear(2000 + parseInt(monthYear[1]), parseInt(monthYear[0]) - 1);
    return expiryDate >= today;
}


////// card type regex
function checkCardType(number) {
    const firstDigit = number[0];
    const firstTwoDigits = parseInt(number.slice(0, 2));
    const firstFourDigits = parseInt(number.slice(0, 4));

    if (firstDigit === '4') {
        return 'Visa';
    } else if ((firstTwoDigits >= 51 && firstTwoDigits <= 55) || (firstFourDigits >= 2221 && firstFourDigits <= 2720)) {
        return 'MasterCard';
    }

    return false;
}

 ///// Disable closing
const modal = new bootstrap.Modal(document.getElementById('creditCardModal'), {
    backdrop: 'static',
    keyboard: false
});


////////////////////////////////// submit
document.getElementById('submitBtn').addEventListener('click', function () {
    let isValid = true;
    const creditCardNumber = document.getElementById('creditCardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');

    const cardType = checkCardType(creditCardNumber.value.replace(/\s/g, ''));

    // Check inputs regex
    if (!creditCardNumber.checkValidity() || creditCardNumber.value.replace(/\s/g, '').length !== 16 || !cardType) {
        creditCardNumber.classList.add('is-invalid');
        isValid = false;
    } else {
        creditCardNumber.classList.remove('is-invalid');
    }

    if (!expiryDate.checkValidity() || !checkExpiryDate(expiryDate.value)) {
        expiryDate.classList.add('is-invalid');
        isValid = false;
    } else {
        expiryDate.classList.remove('is-invalid');
    }

    if (!cvv.checkValidity() || cvv.value.length !== 3) {
        cvv.classList.add('is-invalid');
        isValid = false;
    } else {
        cvv.classList.remove('is-invalid');
    }

    // close if all fields are valid
    if (isValid) {
        modal.hide();
    }
});

