   using Naseej.Models;

namespace Naseej.DTO
{
    public class ProductDTO
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal? Price { get; set; }

        public string? Color { get; set; }

        public long? Stock { get; set; }

        public string? Image { get; set; }

        public string? Image2 { get; set; }

        public string? Image3 { get; set; }

        public string? Image4 { get; set; }

        public long? SalePercentage { get; set; }

    }
}
