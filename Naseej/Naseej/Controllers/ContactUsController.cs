using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class ContactUsController : ControllerBase
    {

        private readonly MyDbContext _db;

        public ContactUsController(MyDbContext db)
        {
            _db = db;
        }


        [HttpPost("sendContactmessage")]
        public async Task<IActionResult> sendContactmessage([FromForm] ContactsDTO c)
        {
            if (c.SenderEmail.IsNullOrEmpty()) return BadRequest("no email sent");

            var newMessage = new Contact
            {
                SenderName = c.SenderName ?? "no name",
                SenderEmail = c.SenderEmail,
                Subject = c.Subject ?? "no subject",
                Message = c.Message ?? "no message",
                Status = "unread",
            };

            if (c == null) return BadRequest("no message recived");

            _db.Contacts.Add(newMessage);
            await _db.SaveChangesAsync();

            var emailService = new EmailServices(); // Assuming EmailServices is available for use here
            await emailService.SendContactEmailAsync(newMessage.SenderName, newMessage.SenderEmail, newMessage.Subject, newMessage.Message);

            return Ok(newMessage);
        }













    }
}
