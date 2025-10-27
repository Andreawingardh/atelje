using Microsoft.EntityFrameworkCore;
using Atelje.Data;
using Atelje.DTOs.Design;
using Atelje.Models;
using Atelje.Services;

namespace Atelje.Tests;

public class DesignServiceTests
{
    [Fact]
    public async Task GetAllDesignsAsync_ReturnsAllDesigns()
    {
        // Arrange - Setup in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetAllDesigns")
            .Options;

        await using var context = new AppDbContext(options);
        
        // Seed test data
        var designs = new List<Design>
        {
            new Design 
            { 
                Id = 1, 
                Name = "Design One",
                DesignData = "Json One",
                UserId = "001",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Design 
            { 
                Id = 2, 
                Name = "Design Two",
                DesignData = "Json Two",
                UserId = "002",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Design 
            { 
                Id = 3, 
                Name = "Design Three",
                DesignData = "Json Three",
                UserId = "003",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };
        
        context.Designs.AddRange(designs);
        await context.SaveChangesAsync();
        
        var designService = new DesignService(context);

        // Act
        var result = await designService.GetAllDesignsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count);
        Assert.Contains(result, d => d.Name == "Design One" && d.DesignData  == "Json One");
        Assert.Contains(result, d => d.Name == "Design Two" && d.DesignData  == "Json Two");
        Assert.Contains(result, d => d.Name == "Design Three" && d.DesignData  == "Json Three");
    }
    
    [Fact]
    public async Task GetDesignByIdAsync_WhenDesignExists_ReturnsDesign()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetDesignById")
            .Options;

        await using var context = new AppDbContext(options);
    
        var design = new Design 
        { 
            Id = 1, 
            Name = "Test Design",
            DesignData = "Design One",
            UserId = "001",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    
        context.Designs.Add(design);
        await context.SaveChangesAsync();

        var designService = new DesignService(context);

        // Act
        var result = await designService.GetDesignByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Design", result.Name);
        Assert.Equal("Design One", result.DesignData);
        Assert.Equal("001", result.UserId);
    }
    
    [Fact]
    public async Task GetDesignByIdAsync_WhenDesignDoesNotExist_ReturnsNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetDesignById_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
        var designService = new DesignService(context);

        // Act
        var result = await designService.GetDesignByIdAsync(999);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task CreateDesignAsync_WithValidData_CreatesAndReturnsDesign()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CreateDesign")
            .Options;

        await using var context = new AppDbContext(options);
        var designService = new DesignService(context);

        var createDto = new CreateDesignDto
        {
            Name = "New Design",
            DesignData = "Json string",
            UserId = "001"
        };

        // Act
        var result = await designService.CreateDesignAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Design", result.Name);
        Assert.Equal("001", result.UserId);
        Assert.True(result.Id > 0);
        Assert.True(result.CreatedAt <= DateTime.UtcNow);
        Assert.True(result.UpdatedAt <= DateTime.UtcNow);
    }
    
    [Fact]
    public async Task UpdateDesignAsync_WhenDesignExists_UpdatesAndReturnsDesign()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_UpdateDesign")
            .Options;

        await using var context = new AppDbContext(options);
    
        var design = new Design 
        { 
            Id = 1, 
            Name = "Original Name",
            DesignData = "Original Design Data",
            UserId = "001",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    
        context.Designs.Add(design);
        await context.SaveChangesAsync();

        var designService = new DesignService(context);

        var updateDto = new UpdateDesignDto
        {
            Name = "Updated Name",
            DesignData = "Updated  Design Data",
        };

        // Act
        var result = await designService.UpdateDesignAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Name", result.Name);
        Assert.Equal("Updated  Design Data", result.DesignData);
        Assert.Equal("001", result.UserId);
        Assert.True(result.UpdatedAt >= design.CreatedAt);
    }
    
    [Fact]
    public async Task UpdateDesignAsync_WhenDesignDoesNotExist_ReturnsNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_UpdateDesign_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
        var designService = new DesignService(context);

        var updateDto = new UpdateDesignDto
        {
            Name = "Updated Name",
            DesignData  = "Json string"
        };

        // Act
        var result = await designService.UpdateDesignAsync(999, updateDto);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task DeleteDesignAsync_WhenDesignExists_DeletesAndReturnsTrue()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DeleteDesign")
            .Options;

        await using var context = new AppDbContext(options);
    
        var design = new Design 
        { 
            Id = 1, 
            Name = "Design To Delete",
            DesignData = "Json string",
            UserId = "001",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    
        context.Designs.Add(design);
        await context.SaveChangesAsync();

        var designService = new DesignService(context);

        // Act
        var result = await designService.DeleteDesignAsync(1);

        // Assert
        Assert.True(result);
        
        // Verify it's actually deleted
        var deletedDesign = await context.Designs.FindAsync(1);
        Assert.Null(deletedDesign);
    }
    
    [Fact]
    public async Task DeleteDesignAsync_WhenDesignDoesNotExist_ReturnsFalse()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DeleteDesign_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
        var designService = new DesignService(context);

        // Act
        var result = await designService.DeleteDesignAsync(999);

        // Assert
        Assert.False(result);
    }
}