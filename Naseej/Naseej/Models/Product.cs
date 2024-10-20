using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Product
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public long CategoryId { get; set; }

    public string? Type { get; set; }

    public decimal? Price { get; set; }

    public string? Color { get; set; }

    public long? Stock { get; set; }

    public string? Image { get; set; }

    public string? Image2 { get; set; }

    public string? Image3 { get; set; }

    public string? Image4 { get; set; }

    public long? SalePercentage { get; set; }

    public string? Description { get; set; }

    public long? BusinessId { get; set; }

    public virtual Business? Business { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Sample> Samples { get; set; } = new List<Sample>();
}
