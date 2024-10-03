using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Business
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public long? OwnerId { get; set; }

    public string? City { get; set; }

    public string? Governate { get; set; }

    public string? Logo { get; set; }

    public string? StorePermit { get; set; }

    public string? BusinessType { get; set; }

    public string? Specialty { get; set; }

    public string? Status { get; set; }

    public long? Phone { get; set; }

    public TimeOnly? OpenHour { get; set; }

    public TimeOnly? CloseHour { get; set; }

    public string? Description { get; set; }

    public string? Adress { get; set; }

    public virtual User? Owner { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Work> Works { get; set; } = new List<Work>();
}
