using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class LoginRegisterController : Controller
    {
        private readonly MyDbContext _db;
        private readonly TokenGenerator _tokenGenerator;

        public LoginRegisterController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
        }



        [HttpPost("register")]
        public IActionResult Register([FromForm] UsersRequestDTO model)
        {

            var existingUser = _db.Users.FirstOrDefault(u => u.UserEmail == model.Email);

            if (existingUser != null)
                return BadRequest("The user already exists.");

            byte[] passwordHash, passwordSalt;

            PasswordHasher.CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);

            var user = new User
            {
                Name = model.UserName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                UserEmail = model.Email,
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(user);



        }


        [HttpPost("login")]
        public IActionResult Login([FromForm] LoginRequestDTO model)
        {
            var user = _db.Users.FirstOrDefault(x => x.UserEmail == model.Email);

            var token = _tokenGenerator.GenerateToken(user.Name  );

            if (!PasswordHasher.VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }
            else if (user == null)
            {
                return BadRequest("user doesn't exist. please sign up.");
            }
            else
            {
                return Ok(new { Token = token });
            }
        }











    }
}
