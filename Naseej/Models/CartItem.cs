using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class CartItem
{
    public long Id { get; set; }

    public long? CartId { get; set; }

    public long? ProductId { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? PriceAtPurchase { get; set; }

    public string? Color { get; set; }

    public bool? IsSample { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual Product? Product { get; set; }
}
