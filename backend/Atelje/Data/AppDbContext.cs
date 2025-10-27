using Atelje.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Atelje.Data;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    
    public DbSet<Design> Designs { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);  // Keeps Identity configuration
        
        modelBuilder.Entity<Design>()
            .Property(d => d.DesignData)
            .HasColumnType("jsonb");
    }
}