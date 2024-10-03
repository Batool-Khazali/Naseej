namespace Naseej.DTO
{
    public class ProfileDTO
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public DateOnly? BirthDay { get; set; }

        public string? Image { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? Governate { get; set; }

        public bool? IsBusinessOwner { get; set; }
    }
}
