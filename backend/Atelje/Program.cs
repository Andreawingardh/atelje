using Atelje.Data;
using Atelje.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//---DATABASE CONFIGURATION----

// Build configuration to read app±settings.json
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.Development.json", optional: true)  // Overrides appsettings.json
    .Build();
using var db = new AppDbContext(configuration);

db.TestUsers.Add(new TestUser { Username = "test", Email = "test@test.com" });
db.SaveChanges();

//--END DATABASE TESTING---

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();