namespace Naseej.DTO
{
    public class AdminEditStoreDTO
    {
        public string Name { get; set; } = null!;

        public string? City { get; set; }

        public string? Governate { get; set; }

        public FormFile? Logo { get; set; }

        public string? Specialty { get; set; }

        public long? Phone { get; set; }

        public TimeOnly? OpenHour { get; set; }

        public TimeOnly? CloseHour { get; set; }

        public string? Description { get; set; }

        public string? Adress { get; set; }
    }
}
