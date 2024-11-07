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

            var existingUser = _db.Users.FirstOrDefault(u => u.Email == model.Email);
            if (existingUser != null)
                return BadRequest("The user already exists.");

            if (model.Email.EndsWith("@naseej.com"))
                return BadRequest("The email address cannot end with @naseej.com.");

            byte[] passwordHash, passwordSalt;

            PasswordHasher.CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);

            var user = new User
            {
                Name = model.UserName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Email = model.Email,
                IsBusinessOwner = false,
            };

            _db.Users.Add(user);
            _db.SaveChanges();


            var check = _db.Carts.Where(a => a.UserId == user.Id).FirstOrDefault();

            if (check != null) return BadRequest("user already has cart");

            var newCart = new Cart
            {
                UserId = user.Id,
            };

            _db.Carts.Add(newCart);
            _db.SaveChanges();

            return Ok();



        }


        [HttpPost("login")]
        public IActionResult Login([FromForm] LoginRequestDTO model)
        {
            var user = _db.Users.FirstOrDefault(x => x.Email == model.Email);

            bool isAdmin = user.Email.EndsWith("@naseej.com", StringComparison.OrdinalIgnoreCase);

            var token = _tokenGenerator.GenerateToken(user.Email, isAdmin  );

            if (!PasswordHasher.VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }

            if (user == null)  return BadRequest("user doesn't exist. please sign up.");
            

                return Ok(new { Token = token , id = user.Id , IsAdmin = isAdmin });
            
        }











    }
}
