using System.Text.Json;
using Atelje.Data;
using Atelje.HealthChecks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Sets up database to check if the Railway database URL is available, otherwise the fallback is the local environment.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("TestDatabase");

    var pgHost = builder.Configuration["PGHOST"];
    Console.WriteLine(pgHost);
    
    if (!string.IsNullOrEmpty(pgHost))
    {
        connectionString = $"Host={pgHost};" + $"Port={builder.Configuration["PGPORT"] ?? "5432"};" +
                           $"Database={builder.Configuration["PGDATABASE"]};" +
                           $"Username={builder.Configuration["PGUSER"]};" +
                           $"Password={builder.Configuration["PGPASSWORD"]};" +
                           $"SSL Mode=Require;Trust Server Certificate=true";
    }

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("No database connection string found.");
    }
    options.UseNpgsql(connectionString);
});

builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("TestDatabase");

var app = builder.Build();

//--HTTP REQUEST PIPELINE--//
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.OpenApiRoutePattern = "/openapi/v1.json";
    });
}

if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    //@TODO: Check if it's really necessary to define these again
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var loggerProd = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        loggerProd.LogInformation("Starting database migration...");
        await dbContext.Database.MigrateAsync();
        loggerProd.LogInformation("Database migration completed");
    }
    catch (Exception ex)
    {
        loggerProd.LogError(ex, "Database migration failed");
        throw;
    }}


app.UseHttpsRedirection();

app.UseAuthorization();

//--HEALTHCHECK ENDPOINT--//
app.MapHealthChecks("/health", new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            var json = JsonSerializer.Serialize(new
            {
                status = report.Status.ToString(),
                checks = report.Entries.ToDictionary(
                    e => e.Key,
                    e => e.Value.Status.ToString())
            });
        
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(json);
        }
    })
    .WithOpenApi();
app.MapControllers();

//---LOGS---//

var logger = app.Services.GetRequiredService<ILogger<Program>>();

if (!string.IsNullOrEmpty(builder.Configuration["PGHOST"]))
{
    logger.LogInformation("🚀 Using Railway database configuration (PGHOST: {Host})", builder.Configuration["PGHOST"]);
}
else
{
    logger.LogInformation("💻 Using local TestDatabase connection from appsettings.json");
}

app.Run();