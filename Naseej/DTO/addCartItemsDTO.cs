namespace Naseej.DTO
{
    public class addCartItemsDTO
    {
        public long? CartId { get; set; }

        public long? ProductId { get; set; }

        public long? Quantity { get; set; }

        public decimal? PriceAtPurchase { get; set; }

        public string? Color { get; set; }

        public bool? IsSample { get; set; }
    }
}
