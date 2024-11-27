using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class AdminReply
{
    public long Id { get; set; }

    public string? Subject { get; set; }

    public string? Message { get; set; }

    public string? Status { get; set; }

    public long? ContactId { get; set; }

    public virtual Contact? Contact { get; set; }
}
