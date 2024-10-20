using Naseej.Models;

namespace Naseej.DTO
{
    public class UserCheckoutItemsDTO
    {
        public decimal? Quantity { get; set; }

        public decimal? PriceAtPurchase { get; set; }

        public string? Color { get; set; }

        public bool? IsSample { get; set; }

        public orderProduct p {  get; set; }

    }


    public class orderProduct
    {
        public string Name { get; set; } = null!;

        public string? Image { get; set; }

    }


}
