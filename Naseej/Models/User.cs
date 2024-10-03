using System;
using System.Collections.Generic;

namespace Naseej.Models;

public partial class User
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[]? PasswordHash { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public string? Image { get; set; }

    public string? Phone { get; set; }

    public string? City { get; set; }

    public string? Governate { get; set; }

    public bool? IsBusinessOwner { get; set; }

    public DateOnly? BirthDay { get; set; }

    public string? Address { get; set; }

    public virtual ICollection<Business> Businesses { get; set; } = new List<Business>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
