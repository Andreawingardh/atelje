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
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.DisplayName)
                .HasMaxLength(50);
            
            entity.Property(u => u.UserName)
                .HasMaxLength(500);
        });
        
        modelBuilder.Entity<Design>(entity =>
        {
            entity.Property(d => d.Name)
                .HasMaxLength(100)
                .IsRequired();
            
            entity.Property(d => d.DesignData)
                .HasColumnType("jsonb")
                .IsRequired();

            entity.Property(d => d.UserId)
                .IsRequired()
                .HasMaxLength(450);
            
            entity.HasOne(d => d.User)
                .WithMany(u => u.Designs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(d => d.CreatedAt);
        });
    }
}