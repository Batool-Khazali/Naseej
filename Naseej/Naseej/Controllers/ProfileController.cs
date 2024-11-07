using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
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
                .Include(x => x.Businesses)
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
                    Image = a.Image,
                    // Select the first business if available, or return null
                    BussinessId = a.Businesses.FirstOrDefault() != null ? a.Businesses.FirstOrDefault().Id : 0,
                    BussinessName = a.Businesses.FirstOrDefault() != null ? a.Businesses.FirstOrDefault().Name : "N/A"
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

            if (Request.Form.Files.Count > 0 && ui.Image != null && ui.Image.Length > 0)
            {

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
                user.Image = ui.Image.FileName ?? user.Image;
                _db.Users.Update(user);
            }

            user.Name = ui.Name ?? user.Name;
            user.Phone = ui.Phone ?? user.Phone;
            user.BirthDay = ui.BirthDay ?? user.BirthDay;
            user.Image = user.Image;


            _db.Users.Update(user);
            _db.SaveChanges();
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

            _db.SaveChanges();

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



        [HttpGet("orderHistory/{userId}")]
        public IActionResult orderHistory(int userId)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var order = _db.Orders
                .Include(a => a.Payments)
                .Include(a => a.OrderItems)
                    .ThenInclude(item => item.Product)
                .Where(a => a.UserId == userId)
                .Select(a => new OrderHistoryDTO
                {
                    OrderDate = a.OrderDate,
                    Id = a.Id,
                    Status = a.Status,
                    FinalTotal = a.FinalTotal,
                    op = new orderPayment
                    {
                        Date = a.Payments.Date,
                        Status = a.Payments.Status,
                        PaymentMethod = a.Payments.PaymentMethod,
                    },
                    oi = a.OrderItems.Select(item => new orderHistoryItems
                    {
                        Quantity = item.Quantity,
                        PriceAtPurchase = item.PriceAtPurchase,
                        Color = item.Color,
                        IsSample = item.IsSample,
                        ip = new itemProduct
                        {
                            Name = item.Product.Name,
                            Image = item.Product.Image
                        }
                    }).ToList(),
                })
                .ToList();

            if (order.IsNullOrEmpty()) return NotFound("No order was found");

            return Ok(order);
        }












    }

}

