using Atelje.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Atelje.Tests;

public class DatabaseFixture : IDisposable
{
    public string ConnectionString { get; }
    public IServiceProvider ServiceProvider { get; }
    
    public DatabaseFixture()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddUserSecrets<DatabaseFixture>(optional: true)
            .AddEnvironmentVariables()
            .Build();
        
        ConnectionString = configuration.GetConnectionString("TestDatabase")
                           ?? throw new InvalidOperationException(
                               "TestDatabase connection string not found.");
        
        // Build service provider
        var services = new ServiceCollection();
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(ConnectionString));
        
        ServiceProvider = services.BuildServiceProvider();
        
        // Create database schema
        using var scope = ServiceProvider.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated();
    }
    
    public void Dispose()
    {
        using var scope = ServiceProvider.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Database.EnsureDeleted();
        
        (ServiceProvider as IDisposable)?.Dispose();
    }
}