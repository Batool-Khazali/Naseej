
let messId = localStorage.getItem("adminMessId");

const admin = localStorage.getItem('isAdmin');


document.addEventListener("DOMContentLoaded", () => {
    if (!admin) {
      Swal.fire({
        title: "Error",
        text: "You are not authorized to access this page.",
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
      

      setTimeout(function () {
        location.href = "../index.html";
      }, 3000);
      
    }

    getMessageDetails()

});


/////////////////////////////

async function getMessageDetails() {
    debugger
    const apiUrl = `https://localhost:7158/api/AdminContact/getMessageDetails/${messId}`;

    const response = await fetch(apiUrl);

    let message = await response.json();


    document.getElementById('senderName').innerText = message.senderName;
    document.getElementById('senderEmail').innerText = message.senderEmail;
    document.getElementById('subject').innerText = message.subject;
    document.getElementById('message').innerText = message.message;
    document.getElementById('status').innerText = message.status;

    if (message.status !== "replied") {
        document.getElementById('replyButton').style.display = 'inline-block';
        document.getElementById('adminReply').innerHTML = 'Not replied yet!';
        document.getElementById('replySubject').value = `Reply to your message: ${message.subject}`;
    }
    else if (message.status == "replied") {
        document.getElementById('replyButton').style.display = 'none';
        document.getElementById('adminReply').innerHTML = message.ar.message;
    }

}



////////////////////

function showReplyForm() {
    document.getElementById('replyForm').style.display = 'block';  
    document.getElementById('replyButton').style.display = 'none'; 
}



//////////////////////// reply
async function sendReply() {

    const form = document.getElementById('replyFormData');
    const replySubject = document.getElementById('replySubject').value;
    const replyMessage = document.getElementById('replyMessage').value;

    if (!replySubject || !replyMessage) {
        Swal.fire({
            title: "Error",
            text: "Both subject and message are required.",
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
          });        return;
    }

    const formData = new FormData(form);


    const response = await fetch(`https://localhost:7158/api/AdminContact/reply/${messId}`, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        Swal.fire({
            title: "Success",
            text: "Reply sent successfully!",
            icon: "success",
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
            location.reload();; 
          }, 3000);
          
    } else {
        Swal.fire({
            title: "Error",
            text: "Failed to send reply. Please try again.",
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
    }

}












