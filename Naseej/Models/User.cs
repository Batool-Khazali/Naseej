using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class User
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public byte[]? PasswordHash { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public string? Image { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Governate { get; set; }

    public bool? IsStoreOwner { get; set; }
}
