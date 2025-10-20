using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using Atelje.Data;
using Atelje.DTOs.User;
using Atelje.Models;
using Atelje.Services;

namespace Atelje.Tests;

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
    
    [Fact]
    public async Task GetUserByIdAsync_WhenUserExists_ReturnsUser()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUserById")
            .Options;

        await using var context = new AppDbContext(options);
    
        var user = new User 
        { 
            Id = "1", 
            Email = "user1@test.com", 
            UserName = "user1",
            DisplayName = "User One",
            CreatedAt = DateTime.UtcNow 
        };
    
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        // Act
        var result = await userService.GetUserByIdAsync(user.Id); // What method do you call? What parameter?

        // Assert
        Assert.NotNull(result); // What should you check?
        Assert.NotNull(result); // What should you check?
        Assert.Equal("user1@test.com", result.Email);
        Assert.Equal("user1", result.UserName);
    }
    
    [Fact]
    public async Task GetUserByIdAsync_WhenUserDoesNotExist_ReturnsNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUserById_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
    
        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        // Act
        var result = await userService.GetUserByIdAsync("nonexistent-id");

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task UpdateUserAsync_WhenUserExists_UpdatesAndReturnsUser()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_UpdateUser")
            .Options;

        await using var context = new AppDbContext(options);
    
        var user = new User 
        { 
            Id = "1", 
            Email = "user1@test.com", 
            UserName = "user1",
            DisplayName = "Original Name",
            CreatedAt = DateTime.UtcNow 
        };
    
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        var updateDto = new UpdateUserDto
        {
            DisplayName = "Updated Name"
        };

        // Act
        var result = await userService.UpdateUserAsync(user.Id, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Name", result.DisplayName);  // What value should this be?
        Assert.Equal("user1@test.com", result.Email);
        Assert.Equal("user1", result.UserName); 
    }
    
    [Fact]
    public async Task UpdateUserAsync_WhenUserDoesNotExist_ReturnsNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_UpdateUser_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
    
        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        var updateDto = new UpdateUserDto
        {
            DisplayName = "Updated Name"
        };

        // Act
        var result = await userService.UpdateUserAsync("nonexistent-id", updateDto);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task CreateUserAsync_WithValidData_CreatesAndReturnsUser()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CreateUser")
            .Options;

        await using var context = new AppDbContext(options);
    
        var mockUserManager = MockUserManager<User>();
        
        mockUserManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
    
        var userService = new UserService(context, mockUserManager.Object);

        var createDto = new CreateUserDto
        {
            Email = "newuser@test.com",
            UserName = "newuser",
            DisplayName = "New User",
            Password = "P@ssword1"
        };

        // Act
        var result = await userService.CreateUserAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("newuser@test.com", result.Email);
        Assert.Equal("newuser", result.UserName);   
        Assert.Equal("New User", result.DisplayName);
    }
    
    [Fact]
    public async Task DeleteUserAsync_WhenUserExists_DeletesAndReturnsTrue()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DeleteUser")
            .Options;

        await using var context = new AppDbContext(options);
    
        var user = new User 
        { 
            Id = "1", 
            Email = "user1@test.com", 
            UserName = "user1",
            DisplayName = "User One",
            CreatedAt = DateTime.UtcNow 
        };
    
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
    
        // Mock FindByIdAsync to return the user
        mockUserManager
            .Setup(x => x.FindByIdAsync("1"))
            .ReturnsAsync(user);
    
        // Mock DeleteAsync to return success
        mockUserManager
            .Setup(x => x.DeleteAsync(user))
            .ReturnsAsync(IdentityResult.Success);
    
        var userService = new UserService(context, mockUserManager.Object);

        // Act
        var result = await userService.DeleteUserAsync("1");

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task DeleteUserAsync_WhenUserDoesNotExist_ReturnsFalse()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DeleteUser_NotFound")
            .Options;

        await using var context = new AppDbContext(options);

        var mockUserManager = MockUserManager<User>();
    
        mockUserManager
            .Setup(x => x.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((User?)null);  // User not found
    
        var userService = new UserService(context, mockUserManager.Object);

        // Act
        var result = await userService.DeleteUserAsync("nonexistent-id");

        // Assert
        Assert.False(result);
    }
    
    // Helper method to mock UserManager
    private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
    {
        var store = new Mock<IUserStore<TUser>>();
        return new Mock<UserManager<TUser>>(
            store.Object, null, null, null, null, null, null, null, null);
    }
}