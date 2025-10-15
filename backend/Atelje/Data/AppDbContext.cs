using Atelje.Models;

namespace Atelje.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class AppDbContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public AppDbContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(Configuration.GetConnectionString("TestDatabase"));
    }
    
    public DbSet<TestUser> TestUsers { get; set; }
}