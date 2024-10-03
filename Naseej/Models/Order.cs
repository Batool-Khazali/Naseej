using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Order
{
    public long Id { get; set; }

    public long? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal? Total { get; set; }

    public string? ShippingAddress { get; set; }

    public string? City { get; set; }

    public string? Governate { get; set; }

    public string? Status { get; set; }

    public decimal? ShippingCost { get; set; }

    public decimal? FinalTotal { get; set; }

    public long? CouponsId { get; set; }

    public long? PaymentsId { get; set; }

    public long? CartId { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Payment? Payments { get; set; }

    public virtual User? User { get; set; }
}
