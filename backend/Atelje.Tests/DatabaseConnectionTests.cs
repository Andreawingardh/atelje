using Npgsql;
using Microsoft.Extensions.Configuration;
using Xunit;  // Make sure Xunit is referenced

namespace Atelje.Tests;

public class DatabaseConnectionTests
{
    private readonly IConfiguration _configuration;
    
    public DatabaseConnectionTests()
    {
        _configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.Development.json")
            .AddEnvironmentVariables()                 // for prod
            .Build();
    }
    
    [Fact]
    [Trait("Category", "LocalOnly")]
    public async Task CanConnectToLocalDatabase()
    {
        var connectionString = _configuration.GetConnectionString("TestDatabase");
        Assert.False(string.IsNullOrWhiteSpace(connectionString), "TestDatabase connection string is missing.");

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        Assert.Equal(System.Data.ConnectionState.Open, connection.State);
    }
    
    [Fact]
    [Trait("Category", "Deployed")]
    public async Task CanConnectToDeployedDatabase()
    {
        // Use public URL for local testing, internal URL for deployed environment
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_PUBLIC_URL") 
                          ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        Assert.False(string.IsNullOrWhiteSpace(databaseUrl));

        Console.WriteLine($"Connecting using: {(Environment.GetEnvironmentVariable("DATABASE_PUBLIC_URL") != null ? "PUBLIC" : "INTERNAL")} URL");

        string connectionString;
    
        if (databaseUrl.StartsWith("postgresql://") || databaseUrl.StartsWith("postgres://"))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require";
        }
        else
        {
            connectionString = databaseUrl;
        }

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        Assert.Equal(System.Data.ConnectionState.Open, connection.State);
    }
}