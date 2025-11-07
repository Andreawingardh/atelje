using System.Text;
using System.Text.Json;
using Atelje.Data;
using Atelje.HealthChecks;
using Atelje.Models;
using Atelje.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://atelje.up.railway.app")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.Configure<IdentityOptions>(options =>
{
    // Require unique email
    options.User.RequireUniqueEmail = false; //@TODO: Change back to true when done testing

    // Password settings (optional, but good to be explicit)
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
});
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDesignService, DesignService>();
builder.Services.AddScoped<ITokenService, TokenService>();
// builder.Services.AddScoped<IEmailSender, FakeEmailSender>();
builder.Services.AddScoped<IResend, ResendClient>();
builder.Services.AddScoped<IEmailSender, ResendEmailSender>();
builder.Services.AddOptions();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["Email:ApiKey"] ?? throw new InvalidOperationException(
        "Email:ApiKey configuration is missing. Add it to user secrets.");
    ;
});
builder.Services.AddHttpClient<ResendClient>();
builder.Services.AddScoped<IR2Service, R2Service>();

//Sets up JWT authentication
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

//Sets up database to check if the Railway database URL is available, otherwise the fallback is the local environment.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("TestDatabase");

    var pgHost = builder.Configuration["PGHOST"];

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
    app.MapScalarApiReference(options => { options.OpenApiRoutePattern = "/openapi/v1.json"; });
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
    }
}


app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

//--HEALTHCHECK ENDPOINT--//
app.MapHealthChecks("/health", new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.StatusCode = report.Status switch
            {
                HealthStatus.Healthy or HealthStatus.Degraded => StatusCodes.Status200OK,
                HealthStatus.Unhealthy => StatusCodes.Status503ServiceUnavailable,
                _ => StatusCodes.Status500InternalServerError
            };

            var json = JsonSerializer.Serialize(new
            {
                status = report.Status.ToString(),
                statusCode = context.Response.StatusCode,
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

app.MapGet("/test", () => "Hello from test endpoint")
    .WithName("TestEndpoint")
    .WithOpenApi();

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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate(); // This applies any pending migrations
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database.");
        throw; // Re-throw so the app doesn't start with a broken database
    }
}

app.Run();