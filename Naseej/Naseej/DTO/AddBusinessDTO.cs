namespace Naseej.DTO
{
    public class AddBusinessDTO
    {
        public string Name { get; set; } = null!;

        public long? OwnerId { get; set; }

        public string? Adress { get; set; }

        public string? City { get; set; }

        public string? Governate { get; set; }

        public string? Description { get; set; }

        public IFormFile? Logo { get; set; }

        public IFormFile? StorePermit { get; set; }

        public string? BusinessType { get; set; }

        public string? Specialty { get; set; }

        public string? Status { get; set; }

        public long? Phone { get; set; }

        public TimeOnly? OpenHour { get; set; }

        public TimeOnly? CloseHour { get; set; }
    }
}
