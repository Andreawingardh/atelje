using Atelje.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Atelje.Data;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    
    public DbSet<Design> Designs { get; set; }
}