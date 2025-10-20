using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using Atelje.Data;
using Atelje.Models;
using Atelje.Services;

namespace Atelje.Tests.Services;

public class UserServiceTests
{
    [Fact]
    public async Task GetAllUsersAsync_ReturnsAllUsers()
    {
        // Arrange - Setup in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetAllUsers")
            .Options;

        await using var context = new AppDbContext(options);
        
        // Seed test data
        var users = new List<User>
        {
            new User 
            { 
                Id = "1", 
                Email = "user1@test.com", 
                UserName = "user1",
                DisplayName = "User One",
                CreatedAt = DateTime.UtcNow 
            },
            new User 
            { 
                Id = "2", 
                Email = "user2@test.com", 
                UserName = "user2",
                DisplayName = "User Two",
                CreatedAt = DateTime.UtcNow 
            },
            new User 
            { 
                Id = "3", 
                Email = "user3@test.com", 
                UserName = "user3",
                DisplayName = "User Three",
                CreatedAt = DateTime.UtcNow 
            }
        };
        
        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Create mock UserManager (not needed for this test, but required by service)
        var mockUserManager = MockUserManager<User>();
        
        var userService = new UserService(context, mockUserManager.Object);

        // Act
        var result = await userService.GetAllUsersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count);
        Assert.Contains(result, u => u.Email == "user1@test.com");
        Assert.Contains(result, u => u.Email == "user2@test.com");
        Assert.Contains(result, u => u.Email == "user3@test.com");
    }
    
    // Helper method to mock UserManager
    private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
    {
        var store = new Mock<IUserStore<TUser>>();
        return new Mock<UserManager<TUser>>(
            store.Object, null, null, null, null, null, null, null, null);
    }
}