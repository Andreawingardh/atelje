using Atelje.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Atelje.Tests;

public class TestFixture
{
    public IServiceProvider ServiceProvider { get; }

    public TestFixture()
    {
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Development.json")
            .Build();

        var services = new ServiceCollection();

        // Register configuration so it can be injected if needed
        services.AddSingleton<IConfiguration>(configuration);

        // Register DbContext with configuration
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("TestDatabase")));

        ServiceProvider = services.BuildServiceProvider();
    }
}
