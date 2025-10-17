using Atelje.Models;

namespace Atelje.Data;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{

    public DbSet<User> Users { get; set; }
    public DbSet<Design> Designs { get; set; }
}