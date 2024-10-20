namespace Naseej.DTO
{
    public class AdminStoresDTO
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string? City { get; set; }

        public string? Governate { get; set; }

        public string? Logo { get; set; }

        public string? BusinessType { get; set; }

        public string? Specialty { get; set; }

        public string? Status { get; set; }

        public long? Phone { get; set; }

        public TimeOnly? OpenHour { get; set; }

        public TimeOnly? CloseHour { get; set; }

        public string? Description { get; set; }

        public string? Adress { get; set; }

        public storeOwner so { get; set; }
    }

    public class storeOwner
    {
        public string Name { get; set; } = null!;

    }
}
