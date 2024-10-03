using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Naseej.Models;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Business> Businesses { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Kit> Kits { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Sample> Samples { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Work> Works { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-644J9U0;Database=Naseej;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Business>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Business__3214EC27965049C9");

            entity.ToTable(tb =>
                {
                    tb.HasTrigger("trg_Business_Delete");
                    tb.HasTrigger("trg_Business_Update");
                });

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Adress).HasColumnType("ntext");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.OwnerId).HasColumnName("OwnerID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");

            entity.HasOne(d => d.Owner).WithMany(p => p.Businesses)
                .HasForeignKey(d => d.OwnerId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Businesse__Owner__70DDC3D8");
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Carts__3214EC27D7E60220");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Carts__UserID__03F0984C");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CartItem__3214EC2760AA344E");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.PriceAtPurchase).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__CartItems__CartI__2CF2ADDF");

            entity.HasOne(d => d.Product).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__CartItems__Produ__2DE6D218");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC27E6080564");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Care).HasColumnType("ntext");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.Usage).HasColumnType("ntext");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Comments__3214EC271CA9F612");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Rating).HasColumnType("decimal(1, 1)");
            entity.Property(e => e.Review).HasColumnType("ntext");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Product).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Comments__Produc__7B5B524B");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Comments__UserID__7A672E12");
        });

        modelBuilder.Entity<Kit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Kits__3214EC2724FABD4E");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orders__3214EC277D8672F0");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.CouponsId).HasColumnName("CouponsID");
            entity.Property(e => e.FinalTotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentsId).HasColumnName("PaymentsID");
            entity.Property(e => e.ShippingCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Cart).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Orders__CartID__2645B050");

            entity.HasOne(d => d.Payments).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PaymentsId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Orders__Payments__25518C17");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Orders__UserID__245D67DE");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__OrderIte__3214EC27E02429D6");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.PriceAtPurchase).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__OrderItem__Order__29221CFB");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__OrderItem__Produ__2A164134");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payments__3214EC2728E0995D");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Date).HasColumnType("datetime");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Products__3214EC27BAC8E86A");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Business).WithMany(p => p.Products)
                .HasForeignKey(d => d.BusinessId)
                .HasConstraintName("FK__Products__Busine__18EBB532");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Products__Catego__534D60F1");
        });

        modelBuilder.Entity<Sample>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Samples__3214EC271FFC2736");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FabricId).HasColumnName("FabricID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SampleSize).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Fabric).WithMany(p => p.Samples)
                .HasForeignKey(d => d.FabricId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Samples__FabricI__5BE2A6F2");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC27EBBE7B2E");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105345B387B56").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Address).HasColumnType("ntext");
            entity.Property(e => e.Email).HasMaxLength(255);
        });

        modelBuilder.Entity<Work>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Works__3214EC2769EDCAAF");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.BusinessId).HasColumnName("BusinessID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Business).WithMany(p => p.Works)
                .HasForeignKey(d => d.BusinessId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Works__BusinessI__73BA3083");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
