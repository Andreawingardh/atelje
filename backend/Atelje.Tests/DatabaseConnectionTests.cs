using Atelje.Data;
using Microsoft.Extensions.Configuration;

namespace Atelje.Tests;

public class DatabaseConnectionTests
{
    [Fact]
    public async Task CanConnectToLocalDatabase()
    {
        // Arrange
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)  
            .Build();
        
        using var db = new AppDbContext(config);
        
        // Act
        var canConnect = await db.Database.CanConnectAsync();
        
        // Assert
        Assert.True(canConnect);
    }
}