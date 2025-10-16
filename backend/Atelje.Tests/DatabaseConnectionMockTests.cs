using Atelje.Data;
using Atelje.Models;
using Microsoft.EntityFrameworkCore;

namespace Atelje.Tests;

public class DatabaseConnectionMockTests
{
    [Fact]
    public async Task CanConnectToInMemoryDatabase()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid())
            .Options;
        
        using var db = new AppDbContext(options);
        
        // Act
        var canConnect = await db.Database.CanConnectAsync();
        
        // Assert
        Assert.True(canConnect);
    }
    
    [Fact]
    public async Task CanAddAndRetrieveTestUser()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid())
            .Options;
        
        using var db = new AppDbContext(options);
        
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