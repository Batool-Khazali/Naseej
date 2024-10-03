using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Sample
{
    public long Id { get; set; }

    public long? FabricId { get; set; }

    public decimal? SampleSize { get; set; }

    public decimal? Price { get; set; }

    public virtual Product? Fabric { get; set; }
}
