using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class BusinessController : ControllerBase
    {
        private readonly MyDbContext _db;

        public BusinessController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("IsBusinessOwner/{userId}")]
        public IActionResult IsBusinessOwner(int userId)
        {
            if (userId <= 0) return BadRequest("invalid user id");

            var user = _db.Users.FirstOrDefault(a => a.Id == userId);

            if (user == null) return NotFound("no user matches");

            return Ok(user.IsBusinessOwner);
        }



        [HttpPost("BusinessRequest/{userId}")]
        public async Task<IActionResult> BusinessRequest(int userId, [FromForm] AddBusinessDTO b)
        {
            if (userId <= 0) return BadRequest("invalid user id");

            //logo upload
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            var imageFile = Path.Combine(ImagesFolder, b.Logo.FileName);

            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                b.Logo.CopyToAsync(stream);
            }

            //  permit upload
            var DocFolder = Path.Combine(Directory.GetCurrentDirectory(), "documents");
            if (!Directory.Exists(DocFolder))
            {
                Directory.CreateDirectory(DocFolder);
            }

            var DocFile = Path.Combine(DocFolder, b.StorePermit.FileName);

            using (var stream = new FileStream(DocFile, FileMode.Create))
            {
                b.StorePermit.CopyToAsync(stream);
            }

            var newBusiness = new Business()
            {
                Name = b.Name,
                OwnerId = userId,
                Adress = b.Adress,
                City = b.City,
                Governate = b.Governate,
                Description = b.Description,
                BusinessType = b.BusinessType,
                Specialty = b.Specialty,
                Phone = b.Phone,
                OpenHour = b.OpenHour,
                CloseHour = b.CloseHour,
                Status = "pending",
                Logo = b.Logo.FileName,
                StorePermit = b.StorePermit.FileName,
            };

            _db.Businesses.Add(newBusiness);
            _db.SaveChanges();
            return Ok();
        }
   































    }


}

