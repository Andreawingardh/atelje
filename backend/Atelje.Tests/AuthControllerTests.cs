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
using Microsoft.Extensions.Logging;


namespace Atelje.Tests;

public class AuthControllerTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IEmailSender> _mockEmailSender;
    private readonly Mock<ILogger<AuthController>> _mockLogger;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        // Setup that every test needs
        _mockUserManager = MockUserManager<User>();
        _mockTokenService = new Mock<ITokenService>();
        _mockEmailSender = new Mock<IEmailSender>();
        _mockLogger = new Mock<ILogger<AuthController>>();

        _controller = new AuthController(
            _mockUserManager.Object,
            _mockTokenService.Object,
            _mockEmailSender.Object,
            _mockLogger.Object
        );
    }

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

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Tell the mock what to return when GenerateToken is called
        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");
        // Act
        var result = await _controller.Register(user);

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

        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError
            {
                Description = "Email is already taken"
            }));


        // Act
        var result = await _controller.Register(user);

        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var errorResponse = Assert.IsType<ErrorResponseDto>(badResult.Value);
        Assert.NotNull(errorResponse.Errors);
        Assert.NotEmpty(errorResponse.Errors);
    }

    [Fact]
    public async Task Register_ValidData_GeneratesEmailConfirmationToken()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@test",
            UserName = "test-user",
            Password = "P@ssword1"
        };

        _mockUserManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");

        // Act
        var result = await _controller.Register(registerDto);

        //Assert
        _mockUserManager.Verify(
            x => x.GenerateEmailConfirmationTokenAsync(It.IsAny<User>()),
            Times.Once()
        );
    }

    [Fact]
    public async Task Register_ValidData_SendsConfirmationEmail()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@test",
            UserName = "test-user",
            Password = "P@ssword1"
        };

        _mockUserManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");

        // Act
        var result = await _controller.Register(registerDto);

        //Assert
        _mockEmailSender.Verify(
            x => x.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.Once()
        );
    }


    [Fact]
    public async Task ConfirmEmail_ValidToken_ConfirmsEmail()
    {
        //Arrange
        var userId = "test_user_id";
        var emailToken = "test_email_token";

        var user = new User
        {
            Id = userId,
            Email = "test@test.com",
            EmailConfirmed = false,
            UserName = "testuser"
        };
        var wasNotConfirmedBefore = user.EmailConfirmed;

        _mockUserManager
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        _mockUserManager
            .Setup(x => x.ConfirmEmailAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        //Act
        var result = await _controller.ConfirmEmail(userId, emailToken);
        //Assert
        Assert.False(wasNotConfirmedBefore);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<EmailConfirmationResponseDto>(okResult.Value);
        Assert.True(response.EmailConfirmed);
    }

    [Fact]
    public async Task ConfirmEmail_AlreadyConfirmed_HandlesGracefully()
    {
        //Arrange
        var userId = "test_user_id";
        var emailToken = "test_email_token";

        var user = new User
        {
            Id = userId,
            Email = "test@test.com",
            EmailConfirmed = true,
            UserName = "testuser"
        };
        
        var wasConfirmedBefore = user.EmailConfirmed;

        _mockUserManager
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        _mockUserManager
            .Setup(x => x.ConfirmEmailAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        //Act
        var result = await _controller.ConfirmEmail(userId, emailToken);
        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<EmailConfirmationResponseDto>(okResult.Value);
        Assert.True(wasConfirmedBefore);
        Assert.Contains("already confirmed", response.Message, StringComparison.OrdinalIgnoreCase);
        Assert.True(response.EmailConfirmed);
    }
    [Fact]
    public async Task ConfirmEmail_InvalidToken_ReturnsBadRequest()
    {
        //Arrange
        var userId = "test_user_id";
        var emailToken = "test_email_token";

        var user = new User
        {
            Id = userId,
            Email = "test@test.com",
            EmailConfirmed = false,
            UserName = "testuser"
        };
        
        var wasNotConfirmedBefore = user.EmailConfirmed;


        _mockUserManager
            .Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        _mockUserManager
            .Setup(x => x.ConfirmEmailAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError
            {
                Description = "Token is invalid"
            }));

        //Act
        var result = await _controller.ConfirmEmail(userId, emailToken);
        //Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var errorResponse = Assert.IsType<ErrorResponseDto>(badResult.Value);
        Assert.False(wasNotConfirmedBefore);
        Assert.False(user.EmailConfirmed);
        Assert.NotNull(errorResponse.Errors);
        Assert.NotEmpty(errorResponse.Errors);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var testUser = new User
        {
            Id = "test-user-id",
            Email = "email@email.com",
            UserName = "testuser",
        };

        var loginDto = new LoginDto
        {
            Email = "email@email.com",
            Password = "P@ssword1"
        };


        _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(testUser);

        _mockUserManager.Setup(x => x.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        // Create a mock of ITokenService


        // Tell the mock what to return when GenerateToken is called
        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");


        // Act
        var result = await _controller.Login(loginDto);

        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);

        Assert.Equal("fake-jwt-token", response.Token);
        Assert.Equal("email@email.com", response.Email);
        Assert.Equal("testuser", response.UserName);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var testUser = new User
        {
            Id = "test-user-id",
            Email = "email@email.com",
            UserName = "testuser",
        };

        var loginDto = new LoginDto
        {
            Email = "email@email.com",
            Password = "P@ssword1"
        };


        _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(testUser);

        _mockUserManager.Setup(x => x.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(false);

        // Tell the mock what to return when GenerateToken is called
        _mockTokenService
            .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
            .Returns("fake-jwt-token");

        //Act
        var result = await _controller.Login(loginDto);

        //Assert
        var badResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
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