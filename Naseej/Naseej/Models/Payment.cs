using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Payment
{
    public long Id { get; set; }

    public string? PaymentMethod { get; set; }

    public DateTime? Date { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
