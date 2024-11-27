namespace Naseej.DTO
{
    public class AdminProductAddEditDto
    {
        public long ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? ProductType { get; set; }

        public decimal? Price { get; set; }

        public string? Color { get; set; }

        public long? Stock { get; set; }

        public string? ProductImage { get; set; }

        public IFormFile? ProductImage2 { get; set; }

        public IFormFile? ProductImage3 { get; set; }

        public IFormFile? ProductImage4 { get; set; }

        public long? SalePercentage { get; set; }

        public string? ProductDescription { get; set; }



        /// <summary>
        /// //////////////////// category
        /// </summary>
        public long CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;

        public string SubCategory { get; set; } = null!;




        /// <summary>
        /// /////////////////////////business
        /// </summary>
        public long BusinessId { get; set; }

        public string BusinessName { get; set; } = null!;

        public string? City { get; set; }

        public string? Adress { get; set; }

    }
}
