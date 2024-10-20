using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Category
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string SubCategory { get; set; } = null!;

    public string? Image { get; set; }

    public string? Usage { get; set; }

    public string? Care { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
