using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Pattern
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public long? BusinessId { get; set; }

    public decimal? Price { get; set; }

    public string? Image { get; set; }

    public string? Description { get; set; }

    public virtual Business? Business { get; set; }
}
