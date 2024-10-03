using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Work
{
    public long Id { get; set; }

    public long? BusinessId { get; set; }

    public string? Image1 { get; set; }

    public string? Image2 { get; set; }

    public string? Image3 { get; set; }

    public string? Image4 { get; set; }

    public string? Image5 { get; set; }

    public decimal? Price { get; set; }

    public virtual Business? Business { get; set; }
}
