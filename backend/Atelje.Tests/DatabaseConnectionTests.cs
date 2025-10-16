using Atelje.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;  // Make sure Xunit is referenced

namespace Atelje.Tests;

public class DatabaseConnectionTests : IClassFixture<TestFixture>
{
    private readonly IServiceProvider _serviceProvider;

    // Single constructor that takes the fixture
    public DatabaseConnectionTests(TestFixture fixture)
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