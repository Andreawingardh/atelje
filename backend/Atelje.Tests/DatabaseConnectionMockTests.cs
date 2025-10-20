using Atelje.Data;
using Atelje.Models;
using Microsoft.EntityFrameworkCore;

namespace Atelje.Tests;

public class DatabaseConnectionMockTests
{
    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }
    
    [Fact]
    [Trait("Category", "Unit")]
    public async Task CanConnectToInMemoryDatabase()
    {
        // Arrange
        await using var db = CreateInMemoryDbContext();
        
        // Act
        var canConnect = await db.Database.CanConnectAsync();
        
        // Assert
        Assert.True(canConnect);
    }
    
    [Fact]
    [Trait("Category", "Unit")]
    public async Task CanAddAndRetrieveTestUser()
    {
        // Arrange
        await using var db = CreateInMemoryDbContext();

        var testUser = new TestUser 
        { 
            Username = "John Doe",
            Email = "john@example.com"
        };
        
        // Act
        db.TestUsers.Add(testUser);
        await db.SaveChangesAsync();
        
        // Assert
        var count = await db.TestUsers.CountAsync();
        Assert.Equal(1, count);
        
        var savedUser = await db.TestUsers.FirstOrDefaultAsync();
        Assert.NotNull(savedUser);
        Assert.Equal("John Doe", savedUser.Username);
        Assert.Equal("john@example.com", savedUser.Email);
    }
}