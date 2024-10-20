using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Comment
{
    public long Id { get; set; }

    public long? UserId { get; set; }

    public long? ProductId { get; set; }

    public decimal? Rating { get; set; }

    public string? Review { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User? User { get; set; }
}
