

const userId = localStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', () => {

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

    getOrderHistory();

    fillDetails();

});


//////////////////////////// date format

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 

    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0');
    

    return `${hours}:${minutes} ${year}/${month}/${day}`;
}

/////////////////////////////// get order history

async function getOrderHistory() {

    // debugger
    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    let data = await response.json();

    const orderHistoryTable = document.getElementById("orderHistoryTableBody");
    orderHistoryTable.innerHTML = '';

    
    data.forEach((element, index) => {

        switch (element.status) {
            case "canceled":
                element.status = "ملغي";
                break;
            case "completed":
                element.status = "مكتمل";
                break;
            case "delivered":
                element.status = "تم الايصال";
                break;
            case "processing":
                element.status = "قيد المعالجة";
                break;
            case "shipping":
                element.status = "قيد الايصال";
                break;
            default:
                break;
        };

        switch (element.op.paymentMethod) {
            case "cash":
                element.op.paymentMethod = "الدفع عند الاستلام";
                break;
            case "card":
                element.op.paymentMethod = "بطاقة ائتمان";
                break;
            default:
                break;
        }

        orderHistoryTable.innerHTML += `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${element.id}</td>
                                            <td>${formatDate(new Date(element.orderDate))}</td>
                                            <td>${element.finalTotal}</td>
                                            <td>${element.status}</td>
                                            <td>${element.op.paymentMethod}</td>
                                            <td><a class="details-button" onclick="toggleOrderDetails(${index}, this)">التفاصيل</a></td>
                                        </tr>

                                        <tr class="details-row hidden"  id="details-row-${index}">
                                            <td colspan="8">
                                                <table class="details-table fl-table" id="details-table-${index}">
                                                    <thead>
                                                        <tr>
                                                            <th>صورة المنتج</th>
                                                            <th>اسم المنتج</th>
                                                            <th>الكمية</th>
                                                            <th>السعر</th>
                                                            <th>اللون</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        `;

    });
}



async function fillDetails() {

    // debugger
    const url = `https://localhost:7158/api/Profile/orderHistory/${userId}`;
    const response = await fetch(url);
    let data = await response.json();



    data.forEach((element, index) => {

        const detailsTableBody = document.getElementById(`details-table-${index}`).querySelector('tbody');
        detailsTableBody.innerHTML = "";

        
        element.oi.forEach(x => {

            switch(x.color) {
                case 'red':
                  arabicColor = 'أحمر';
                  break;
                case 'blue':
                  arabicColor = 'أزرق';
                  break;
                case 'green':
                  arabicColor = 'أخضر';
                  break;
                case 'yellow':
                  arabicColor = 'أصفر';
                  break;
                case 'white':
                  arabicColor = 'أبيض';
                  break;
                case 'black':
                  arabicColor = 'أسود';
                  break;
                case 'gray':
                  arabicColor = 'رمادي';
                  break;
                case 'pink':
                  arabicColor = 'وردي';
                  break;
                case 'purple':
                  arabicColor = 'بنفسجي';
                  break;
                case 'orange':
                  arabicColor = 'برتقالي';
                  break;
                case 'brown':
                  arabicColor = 'بني';
                  break;
                default:
                  arabicColor = '';
                  break;
              }

            detailsTableBody.innerHTML += `
                                            <td><img src="../../images/${x.ip.image}" alt="${x.ip.name}"></td>
                                            <td>${x.ip.name}</td>
                                            <td>${x.quantity}</td>
                                            <td>${x.priceAtPurchase}</td>
                                            <td><span style="background-color: ${x.color}; color: ${x.color}; display: inline-block; width: 1em; height: 1em; border-radius: 50%;"></span> ${arabicColor}</td>
                                        `;
        })
    });

}

function toggleOrderDetails(index, element) {

    // debugger
    const detailsRow = document.getElementById(`details-row-${index}`);
    const isHidden = detailsRow.classList.contains('hidden');

    // Toggle the visibility of the details row
    if (isHidden) {
        detailsRow.classList.remove('hidden');
        element.textContent = 'إخفاء'; 
    } else {
        detailsRow.classList.add('hidden');
        element.textContent = 'التفاصيل'; 
    }
}









