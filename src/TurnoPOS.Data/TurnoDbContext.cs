using Microsoft.EntityFrameworkCore;
using TurnoPOS.Data.Models;

namespace TurnoPOS.Data;

public class TurnoDbContext(DbContextOptions<TurnoDbContext> options) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .Property(o => o.PaymentType)
            .HasDefaultValue(PaymentType.Cash)
            .HasSentinel(0);
    }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderLine> OrderLines { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Department> Departments { get; set; }
}