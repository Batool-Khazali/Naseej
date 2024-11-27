namespace Naseej.DTO
{
    public class AdminCategoryDTO
    {
        public string Name { get; set; } = null!;

        public string SubCategory { get; set; } = null!;

        public IFormFile? Image { get; set; }

        public string? Usage { get; set; }

        public string? Care { get; set; }

        public string? Description { get; set; }
    }
}
