using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Cart
{
    public long Id { get; set; }

    public long? UserId { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual User? User { get; set; }
}
