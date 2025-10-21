using System.Runtime.InteropServices.JavaScript;
using Atelje.Controllers;
using Atelje.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using Atelje.Data;
using Atelje.DTOs;
using Atelje.DTOs.Auth;
using Atelje.DTOs.User;
using Atelje.Models;
using Atelje.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;


namespace Atelje.Tests;

public class AuthControllerTests
{
    [Fact]
    public async Task Register_ValidData_ReturnsOkWithToken()
    {
        // Arrange
        var user = new RegisterDto
        {
            Email = "email@email.com",
            UserName = "Testuser",
            Password = "P@ssword1"
        };
        var mockUserManager = MockUserManager<User>();

        mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Create a mock of ITokenService
        var mockTokenService = new Mock<ITokenService>();

        // Tell the mock what to return when GenerateToken is called
        mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");

        var mockAuthController = new AuthController(mockUserManager.Object, mockTokenService.Object);
        // Act
        var result = await mockAuthController.Register(user);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);
        
        Assert.Equal("fake-jwt-token", response.Token);
        Assert.Equal("email@email.com", response.Email);
        Assert.Equal("Testuser", response.UserName);
    }

    [Fact]
    public async Task Register_WhenUserManagerFails_ReturnsBadRequest()
    {
        // Arrange
        var user = new RegisterDto
        {
            Email = "email@email.com",
            UserName = "Testuser",
            Password = "P@ssword1"
        };
        
        var mockTokenService = new Mock<ITokenService>();
        
        mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");
        
        var mockUserManager = MockUserManager<User>();

        mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError 
            { 
                Description = "Email is already taken" 
            }));
        
        var mockAuthController = new AuthController(mockUserManager.Object, mockTokenService.Object);
        // Act
        var result = await mockAuthController.Register(user);
    
        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var errorResponse = Assert.IsType<ErrorResponseDto>(badResult.Value);
        Assert.NotNull(errorResponse.Errors);
        Assert.NotEmpty(errorResponse.Errors);


    }
    private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
    {
        var store = new Mock<IUserStore<TUser>>();
        return new Mock<UserManager<TUser>>(
            store.Object, null, null, null, null, null, null, null, null);
    }
}