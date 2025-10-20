using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class DatabaseFixture : IDisposable
{
    public string ConnectionString { get; }
    
    public DatabaseFixture()
    {
        // Build configuration from multiple sources (order matters - later sources override earlier ones)
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true) // Base config
            .AddUserSecrets<DatabaseFixture>(optional: true) // Local dev secrets (overrides appsettings.json)
            .AddEnvironmentVariables() // CI/CD variables (overrides everything)
            .Build();
        
        ConnectionString = configuration.GetConnectionString("TestDatabase")
                           ?? throw new InvalidOperationException(
                               "TestDatabase connection string not found. " +
                               "Please set it using: dotnet user-secrets set \"ConnectionStrings:TestDatabase\" \"your-connection-string\"");
        
        // Create database schema
        using var context = CreateDbContext();
        context.Database.EnsureCreated();
    }
    
    public YourDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YourDbContext>()
            .UseNpgsql(ConnectionString)
            .Options;
        return new YourDbContext(options);
    }
    
    public void Dispose()
    {
        // Cleanup database after all tests
        using var context = CreateDbContext();
        context.Database.EnsureDeleted();
    }
}