using Naseej.Models;

namespace Naseej.DTO
{
    public class UserCartItemsDTO
    {
        public long? ProductId { get; set; }

        public decimal? Quantity { get; set; }

        public decimal? PriceAtPurchase { get; set; }

        public string? Color { get; set; }

        public bool? IsSample { get; set; }

        public CartProduct p { get; set; }
    }


    public class CartProduct
    {
        public string Name { get; set; } = null!;

        public string? Color { get; set; }

        public string? Image { get; set; }

    }
}
