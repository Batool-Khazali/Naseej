namespace Naseej.DTO
{
    public class productsFilterDTO
    {
        public string? productName { get; set; }

        public string? categoryName { get; set; }

        public string? subCategoryName { get; set; }

        public decimal? minPrice { get; set; }

        public decimal? maxPrice { get; set; }

        public List<string>? color { get; set; }

        public string? businessName { get; set; }

        public string? businessGovernate { get; set; }




        /// <summary>
        /// //////////////////////// pagination
        /// </summary>
        public int page { get; set; }

        public int take { get; set; }
    }
}
