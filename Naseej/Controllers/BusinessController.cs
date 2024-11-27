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
            if (userId <= 0) return BadRequest("Invalid user ID");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "logo");
            var PermitsFolder = Path.Combine(Directory.GetCurrentDirectory(), "permits");

            if (!Directory.Exists(ImagesFolder))
                Directory.CreateDirectory(ImagesFolder);

            if (!Directory.Exists(PermitsFolder))
                Directory.CreateDirectory(PermitsFolder);

            string uniqueLogoFileName = null;
            string uniquePermitFileName = null;

            // Logo upload
            if (b.Logo != null && b.Logo.Length > 0)
            {
                var logoFileName = Path.GetFileName(b.Logo.FileName);
                uniqueLogoFileName = $"{Guid.NewGuid()}_{logoFileName}";
                var logoFilePath = Path.Combine(ImagesFolder, uniqueLogoFileName);

                await using (var stream = new FileStream(logoFilePath, FileMode.Create))
                {
                    await b.Logo.CopyToAsync(stream);
                }
                Console.WriteLine($"Logo uploaded successfully: {uniqueLogoFileName}");
            }

            // Permit upload
            if (b.StorePermit != null && b.StorePermit.Length > 0)
            {
                var permitFileName = Path.GetFileName(b.StorePermit.FileName);
                uniquePermitFileName = $"{Guid.NewGuid()}_{permitFileName}";
                var permitFilePath = Path.Combine(PermitsFolder, uniquePermitFileName);

                await using (var stream = new FileStream(permitFilePath, FileMode.Create))
                {
                    await b.StorePermit.CopyToAsync(stream);
                }
                Console.WriteLine($"Permit uploaded successfully: {uniquePermitFileName}");
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
                Logo = uniqueLogoFileName, // Save the unique file name
                StorePermit = uniquePermitFileName // Save the unique file name
            };

            _db.Businesses.Add(newBusiness);
            _db.SaveChanges();
            return Ok();
        }

































    }


}

