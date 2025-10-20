using Atelje.Data;
using Microsoft.Extensions.DependencyInjection;

namespace Atelje.Tests;

public class DatabaseConnectionTests : IClassFixture<DatabaseFixture>
{
    private readonly IServiceProvider _serviceProvider;

    public DatabaseConnectionTests(DatabaseFixture fixture)
    {
        _serviceProvider = fixture.ServiceProvider;
    }

    [Fact]
    [Trait("Category", "LocalOnly")]
    public async Task CanConnectToLocalDatabase()
    {
        await using var db = _serviceProvider.GetRequiredService<AppDbContext>();

        var canConnect = await db.Database.CanConnectAsync();

        Assert.True(canConnect);
    }
}