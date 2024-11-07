namespace Naseej.DTO
{
    public class AdminAllUsersDTO
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Image { get; set; }

        public string? City { get; set; }

        public string? Address { get; set; }
    }
}
