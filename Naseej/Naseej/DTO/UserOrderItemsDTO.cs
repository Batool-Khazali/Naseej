namespace Naseej.DTO
{
    public class UserOrderItemsDTO
    {
        public long? OrderId { get; set; }

        public long? ProductId { get; set; }

        public decimal? Quantity { get; set; }

        public decimal? PriceAtPurchase { get; set; }

        public string? Color { get; set; }

        public bool? IsSample { get; set; }
    }
}
