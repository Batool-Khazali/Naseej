using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class OrderItem
{
    public long Id { get; set; }

    public long? OrderId { get; set; }

    public long? ProductId { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? PriceAtPurchase { get; set; }

    public string? Color { get; set; }

    public bool? IsSample { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product? Product { get; set; }
}
