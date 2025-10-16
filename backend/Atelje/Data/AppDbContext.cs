using Atelje.Models;

namespace Atelje.Data;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{

    public DbSet<TestUser> TestUsers { get; set; }
}