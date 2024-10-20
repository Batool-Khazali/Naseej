namespace Naseej.DTO
{
    public class OrderHistoryDTO
    {
        public long Id { get; set; }

        public DateTime? OrderDate { get; set; }

        public string? Status { get; set; }

        public decimal? FinalTotal { get; set; }

        public orderPayment op {  get; set; }

        public List<orderHistoryItems> oi { get; set; }

    }

    public class orderPayment
    {
        public string? PaymentMethod { get; set; }

        public DateTime? Date { get; set; }

        public string? Status { get; set; }
    }

    public class orderHistoryItems
    {
        public decimal? Quantity { get; set; }

        public decimal? PriceAtPurchase { get; set; }

        public string? Color { get; set; }

        public bool? IsSample { get; set; }

        public itemProduct ip { get; set; }
    }

    public class itemProduct
    {
        public string Name { get; set; } = null!;

        public string? Image { get; set; }

    }




}
