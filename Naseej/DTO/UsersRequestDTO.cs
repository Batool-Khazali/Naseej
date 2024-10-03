using System.ComponentModel.DataAnnotations;

namespace Naseej.DTO
{
    public class UsersRequestDTO
    {
        [Required(ErrorMessage = "please enter your user name")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "user name should be between 6 and 50 ")]
        [RegularExpression(@"^([A-Za-z][A-Za-z0-9_\s]*)$",
ErrorMessage = "Only alphabets, numbers, underscores, and spaces are allowed. Start with a letter.")]
        public string UserName { get; set; }


        [Required(ErrorMessage = "please enter your password")]
        [StringLength(50, MinimumLength = 8, ErrorMessage = "password should be between 8 and 50 ")]
        [DataType(DataType.Password, ErrorMessage = "please enter your password")]
        [RegularExpression(@"^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9A-Za-z]).*$",
            ErrorMessage = "password must have 1 capital letter, 1 small letter, 1 number and any symbol")]
        public string Password { get; set; }


        [Required(ErrorMessage = "please enter your email")]
        [EmailAddress(ErrorMessage = "please enter a valid email")]
        public string Email { get; set; }

        public bool? IsBusinessOwner { get; set; }

    }
}
