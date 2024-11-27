using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminUsersController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AdminUsersController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("getAllUsers")]
        public IActionResult getAllUsers()
        {
            var users = _db.Users
                .Select(a => new AdminAllUsersDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    Address = a.Address,
                    City = a.City,
                    Image = a.Image,
                })
                .ToList();

            if (users.IsNullOrEmpty()) return NotFound("no user was found");

            return Ok(users);
        }



        [HttpGet("getusersByNameOrEmail/{text}")]
        public IActionResult getusersByNameOrEmail ( string text)
        {
            if (text.IsNullOrEmpty()) return BadRequest("invalid search");

            var users = _db.Users
                .Where(a => a.Name.Contains(text) || a.Email.Contains(text))
                .Select(a => new AdminAllUsersDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    Address = a.Address,
                    City = a.City,
                    Image = a.Image,
                })
                .ToList();

            if (users.IsNullOrEmpty()) return NotFound("no user was found that matches the search");

            return Ok(users);

        }


        [HttpGet("getBusinessOwners/{status}")]
        public IActionResult getBusinessOwners(bool status)
        {
            if (status == null ) return BadRequest("invalid search");

            var users = _db.Users
                .Where(a => a.IsBusinessOwner == status)
                .Select(a => new AdminAllUsersDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    Address = a.Address,
                    City = a.City,
                    Image = a.Image,
                })
                .ToList();

            if (users.IsNullOrEmpty()) return NotFound("no user was found that matches the search");

            return Ok(users);

        }


        [HttpGet("getusersByCity/{city}")]
        public IActionResult getusersByCity(string city)
        {
            if (city.IsNullOrEmpty()) return BadRequest("invalid search");

            var users = _db.Users
                .Where(a => a.City == city)
                .Select(a => new AdminAllUsersDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    Address = a.Address,
                    City = a.City,
                    Image = a.Image,
                })
                .ToList();

            if (users.IsNullOrEmpty()) return NotFound("no user was found that matches the search");

            return Ok(users);

        }












    }
}
