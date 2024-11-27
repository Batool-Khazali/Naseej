using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class AdminContactController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AdminContactController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("getAllMessages")]
        public IActionResult getAllMessages()
        {
            var messages = _db.Contacts.ToList();

            if (messages.IsNullOrEmpty()) return NotFound("no message was found");

            return Ok(messages);
        }


        [HttpGet("getMessageDetails/{messId}")]
        public IActionResult getMessageDetails(int messId)
        {
            if (messId <= 0) return BadRequest("invalid id");

            var message = _db.Contacts
                .Include(x => x.AdminReplies)
                .FirstOrDefault(a => a.Id == messId);

            if (message == null) return NotFound("no message was found");

            if (message.Status == "unread")
            {
                message.Status = "read";
                _db.Contacts.Update(message);
                _db.SaveChanges();
            }

            var messageDto = new ContactDto
            {
                Id = message.Id,
                SenderName = message.SenderName,
                SenderEmail = message.SenderEmail,
                Subject = message.Subject,
                Message = message.Message,
                Status = message.Status,
                ar = message.AdminReplies.Select(reply => new AdminReplyDto
                {
                    Id = reply.Id,
                    Subject = reply.Subject,
                    Message = reply.Message,
                    Status = reply.Status
                }).FirstOrDefault()
            };

            return Ok(messageDto);
        }


        [HttpPost("reply/{messId}")]
        public async Task<IActionResult> reply(int messId, [FromForm] AdminReplyDTO r)
        {
            if (messId <= 0) return BadRequest("invalid id");
            if (r == null) return BadRequest("empty reply");

            var reply = new AdminReply
            {
                Subject = r.Subject,
                Message = r.Message,
                Status = "sent",
                ContactId = messId,
            };


            _db.AdminReplies.Add(reply);

            var message = _db.Contacts.FirstOrDefault(a => a.Id == messId);

            message.Status = "replied";

            _db.Contacts.Update(message);

            await _db.SaveChangesAsync();

            var emailService = new EmailServices();
            await emailService.SendReplyEmailAsync(
                senderEmail: "batoulkhazali96@gmail.com",
                toEmail: message.SenderEmail,
                subject: reply.Subject,
                message: reply.Message
            );


            return Ok();
        }


        [HttpGet("getContactByStatus/{status}")]
        public IActionResult getContactByStatus(string status)
        {
            var messagesList = _db.Contacts
                .Where(a => a.Status == status)
                .ToList();

            if (messagesList.IsNullOrEmpty()) return NotFound("no message was found that matches the search");

            return Ok(messagesList);
        }


        [HttpPost("filterContacts")]
        public IActionResult filterContacts([FromBody]contactsFilterDTO filter)
        {
            if (filter == null) return BadRequest("an error while applying filters");

            var messages = _db.Contacts.AsQueryable();

            if (!string.IsNullOrEmpty(filter.nameAndEmail))
                messages = messages
                    .Where(a => a.SenderName.ToLower().Trim().Contains(filter.nameAndEmail.ToLower().Trim()) || a.SenderEmail.ToLower().Trim().Contains(filter.nameAndEmail.ToLower().Trim()));
        
            if (!string.IsNullOrEmpty(filter.subject))
                messages = messages
                    .Where(a => a.Subject.ToLower().Trim().Contains(filter.subject.ToLower().Trim()) );

            if (!string.IsNullOrEmpty(filter.status))
                messages = messages.Where(a => a.Status ==  filter.status);

            var contactsList = messages.ToList();

            if (contactsList.IsNullOrEmpty()) 
                return NotFound("the search is empty");

            return Ok(contactsList);
        }



    }

}
