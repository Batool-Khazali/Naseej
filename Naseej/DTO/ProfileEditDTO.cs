namespace Naseej.DTO
{
    public class ProfileEditDTO
    {
        public string Name { get; set; } = null!;

        public IFormFile? Image { get; set; }

        public string? Phone { get; set; }

        public DateOnly? BirthDay { get; set; }

    }
}
