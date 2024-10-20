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

            var message = _db.Contacts.FirstOrDefault(a => a.Id == messId);

            if (message == null) return NotFound("no message was found");

            if (message.Status == "unread")
            {
                message.Status = "read";
                _db.Contacts.Update(message);
                _db.SaveChanges();
            }

            return Ok(messId);
        }


        [HttpPost("reply/{messId}")]
        public IActionResult reply(int messId, [FromForm] AdminReplyDTO r)
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
            _db.SaveChanges();
            return Ok();
        }










    }
    
}
