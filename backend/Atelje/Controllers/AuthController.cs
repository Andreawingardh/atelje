using System.Security.Claims;
using Atelje.DTOs;
using Atelje.DTOs.Auth;
using Atelje.Models;
using Atelje.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<User> userManager, ITokenService tokenService, IEmailSender emailSender, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailSender = emailSender;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        var user = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
            DisplayName = dto.DisplayName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new ErrorResponseDto
            {
                Errors = result.Errors.Select(e => e.Description)
            });
        }

        var token = _tokenService.GenerateToken(user.Id, user.Email);

        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var emailConfirmationUrl = $"http://localhost:3000/confirm-email?userId={user.Id}&token={emailToken}";

        var innerHtmlMessage = $"""
                                <p> Hi {user.UserName} </p>
                                <p>Please click the following URL to confirm your email</p>:
                                <a href="{emailConfirmationUrl}">Click me</a>
                                """;
        try
        {
            await _emailSender.SendEmailAsync(user.Email, "Confirm your email", innerHtmlMessage);
        }
        catch (Exception exception)
        {
            _logger.LogError("There was an error sending confirmation email: {Exception}", exception);
        }

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null) return Unauthorized( new ErrorResponseDto { Errors = ["Invalid email or password"] });

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        
        if(!isPasswordValid) return Unauthorized(new ErrorResponseDto { Errors = ["Invalid email or password"] });

        var token = _tokenService.GenerateToken(user.Id, user.Email!);
        
        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed
        });

    }
    
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
    
        var user = await _userManager.FindByIdAsync(userId!);
    
        if (user == null)
            return NotFound();
    
        return Ok(new AuthResponseDto
        {
            Token = "",
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName
        });
    }

}