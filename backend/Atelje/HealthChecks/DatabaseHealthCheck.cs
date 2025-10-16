namespace Atelje.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Data;

public class DatabaseHealthCheck(AppDbContext context) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext healthCheckContext,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await context.Database.CanConnectAsync(cancellationToken);
            
            var testQuery = await context.TestUsers
                .Select(u => 1)
                .FirstOrDefaultAsync(cancellationToken);
            
        }
        catch(Exception e)
        {
            return HealthCheckResult.Unhealthy(
                description: $"Database connection failed: {e.Message}", 
                exception: e,
                data: new Dictionary<string, object>
                {
                    { "error", e.Message },
                    { "innerException", e.InnerException?.Message ?? "none" }
                });
        }
        
        var data = new Dictionary<string, object>
        {
            { "database", context.Database.GetDbConnection().Database },
            { "state", context.Database.GetDbConnection().State.ToString() }
        };
        
        return HealthCheckResult.Healthy(
            description: "Database is responsive",
            data: data);
    }
}