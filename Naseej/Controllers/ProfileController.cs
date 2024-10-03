using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class ProfileController : ControllerBase
    {

        private readonly MyDbContext _db;

        public ProfileController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("getUserInfo/{UserId}")]
        public IActionResult UserInfo(int UserId)
        {
            if (UserId <= 0) return BadRequest("invalid user id");

            var user = _db.Users
                .Where(a => a.Id == UserId)
                .Select(a => new ProfileDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    Phone = a.Phone,
                    Address = a.Address,
                    City = a.City,
                    Governate = a.Governate,
                    IsBusinessOwner = a.IsBusinessOwner,
                    BirthDay = a.BirthDay,
                })
                .FirstOrDefault();

            if (user == null) return NotFound("there's no user with that id");

            return Ok(user);
        }




        [HttpPut("updateUserProfile/{UserId}")]
        public async Task<ActionResult> updateUserProfile(int UserId, [FromForm] ProfileEditDTO ui)
        {
            if (UserId <= 0 || ui == null) return BadRequest("invalid user id");

            var user = _db.Users.FirstOrDefault(a => a.Id == UserId);

            if (user == null) return NotFound("no user found");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            var imageFile = Path.Combine(ImagesFolder, ui.Image.FileName);

            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await ui.Image.CopyToAsync(stream);
            }

            user.Name = ui.Name;
            user.Phone = ui.Phone;
            user.BirthDay = ui.BirthDay;
            user.Image = ui.Image.FileName;


            _db.Users.Update(user);
            _db.SaveChangesAsync();
            return Ok();
        }


        [HttpPost("resetPassword")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDTO pwd)
        {
            if (pwd == null) return BadRequest();

            var user = _db.Users.Find(pwd.Id);
            if (user == null)
                return NotFound("User not found.");

            // Verify the old password
            if (!PasswordHasher.VerifyPasswordHash(pwd.OldPassword, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Old password is incorrect.");

            // Hash the new password
            PasswordHasher.CreatePasswordHash(pwd.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _db.SaveChanges(); // Save changes synchronously

            return Ok("Password reset successfully.");
        }


        [HttpPut("userLocation/{userId}")]
        public IActionResult userLocation(int userId, [FromForm] userLocationDTO ul)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var user = _db.Users.FirstOrDefault(a => a.Id == userId);

            if (user == null) return NotFound("no user found");

            user.Address = ul.Address;
            user.City = ul.City;
            user.Governate = ul.Governate;

            _db.Users.Update(user);
            _db.SaveChanges();
            return Ok(user);
        }
















    }

}

