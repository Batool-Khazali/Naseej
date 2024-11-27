namespace Naseej.DTO
{
    public class LatestProductDTO
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string? CategoryName { get; set; }

        public decimal? Price { get; set; }

        public long? Stock { get; set; }

        public string? Image { get; set; }

        public string? Description { get; set; }

    }
}
