using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Kit
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Content { get; set; }

    public string? Description { get; set; }
}
