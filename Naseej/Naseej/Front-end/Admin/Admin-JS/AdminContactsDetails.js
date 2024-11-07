
let messId = localStorage.getItem("adminMessId");


document.addEventListener("DOMContentLoaded", () => {

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
        document.getElementById('replyButton').style.display = 'inline-block';  // Show the reply button
    }

}



////////////////////

function showReplyForm() {
    document.getElementById('replyForm').style.display = 'block';  // Show the reply form
    document.getElementById('replyButton').style.display = 'none';  // Hide the reply button
}



//////////////////////// reply
async function sendReply() {

    const replySubject = document.getElementById('replySubject').value;
    const replyMessage = document.getElementById('replyMessage').value;

    if (!replySubject || !replyMessage) {
        alert("Subject and Message are required!");
        return;
    }

    const replyData = new FormData();

    replyData.append('Subject', replySubject);
    replyData.append('Message', replyMessage);


    const response = await fetch(`https://localhost:7158/api/AdminContact/reply/${messId}`, {
        method: 'POST',
        body: replyData
    });

    if (response.ok) {
        alert("Reply sent successfully!");
        // Optionally, you can hide the form and reset the fields here
        document.getElementById('replyForm').style.display = 'none';
        document.getElementById('replySubject').value = '';
        document.getElementById('replyMessage').value = '';
        location.reload();
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong!"}`);
    }

}












