using Npgsql;
using Microsoft.Extensions.Configuration;

namespace Atelje.Tests;

public class DatabaseConnectionTests
{
    private readonly IConfiguration _configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.Development.json")
        .Build();

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
}