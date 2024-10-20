namespace Naseej.DTO
{
    public class EditProductDTO
    {
        public string Name { get; set; } = null!;

        public long CategoryId { get; set; }

        public decimal? Price { get; set; }

        public string? Color { get; set; }

        public IFormFile? Image { get; set; }

        public IFormFile? Image2 { get; set; }

        public IFormFile? Image3 { get; set; }

        public IFormFile? Image4 { get; set; }

        public string? Description { get; set; }

        public long? SalePercentage { get; set; }

        public long? Stock { get; set; }


    }
}
