using System.ComponentModel.DataAnnotations;

namespace Naseej.DTO
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "please enter your email")]
        [EmailAddress(ErrorMessage = "please enter a valid email")]
        public string Email { get; set; }



        [Required(ErrorMessage = "please enter your password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
