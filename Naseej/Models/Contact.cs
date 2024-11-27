using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class Contact
{
    public long Id { get; set; }

    public string? SenderName { get; set; }

    public string SenderEmail { get; set; } = null!;

    public string? Subject { get; set; }

    public string? Message { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<AdminReply> AdminReplies { get; set; } = new List<AdminReply>();
}
