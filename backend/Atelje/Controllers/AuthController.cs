using System.Security.Claims;
using System.Text;
using Atelje.DTOs;
using Atelje.DTOs.Auth;
using Atelje.Models;
using Atelje.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Atelje.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<User> userManager, ITokenService tokenService, IEmailSender emailSender,
        ILogger<AuthController> logger, IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailSender = emailSender;
        _logger = logger;
        _configuration = configuration;
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
        _logger.LogInformation("Email token: {EmailToken}", emailToken);

        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

        _logger.LogInformation("Original token: {Token}", emailToken);
        _logger.LogInformation("Decoded token: {Encoded token}", encodedToken);

        var frontendBaseUrl = _configuration["FrontendBaseUrl"] ?? "http://localhost:3000";
        var emailConfirmationUrl = $"{frontendBaseUrl}/confirm-email?userId={user.Id}&token={encodedToken}";

        var innerHtmlMessage = $"""
                                <p> Hi {user.UserName} </p>
                                <p>Please click the following URL to confirm your email</p>:
                                <a href="{emailConfirmationUrl}">Click me</a>
                                """;

        var isEmailSent = true;
        try
        {
            await _emailSender.SendEmailAsync(user.Email, "Confirm your email", innerHtmlMessage);
        }
        catch (Exception exception)
        {
            _logger.LogError("There was an error sending confirmation email: {Exception}", exception);
            isEmailSent = false;
        }


        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed,
            EmailSent = isEmailSent
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null) return Unauthorized(new ErrorResponseDto { Errors = ["Invalid email or password"] });

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);

        if (!isPasswordValid) return Unauthorized(new ErrorResponseDto { Errors = ["Invalid email or password"] });

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
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed
        });
    }

    [HttpGet("confirm-email")]
    public async Task<ActionResult<EmailConfirmationResponseDto>> ConfirmEmail(string userId, string token)
    {
        if (token == null || userId == null)
        {
            return BadRequest(new ErrorResponseDto { Errors = ["Token or user is invalid"] });
        }

        try
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new ErrorResponseDto { Errors = ["User can't be found"] });
            }

            if (user.EmailConfirmed)
            {
                var dto = new EmailConfirmationResponseDto
                {
                    Message = "Email is already confirmed",
                    EmailConfirmed = true
                };
                return Ok(dto);
            }

            var decodedBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedBytes);

            _logger.LogInformation("Received token: {Token}", token);
            _logger.LogInformation("Decoded token: {Decoded}", decodedToken);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Errors = result.Errors.Select(e => e.Description)
                });
            }

            var value = new EmailConfirmationResponseDto
            {
                Message = "Your email has been confirmed, you can now log in",
                EmailConfirmed = true
            };
            return Ok(value);
        }
        catch (Exception exception)
        {
            _logger.LogError(" {Exception}", exception);
            return BadRequest(new ErrorResponseDto { Errors = [$"There was an error confirming the email"] });
        }
    }

    [HttpPost("resend-confirmation-email")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> ResendConfirmationEmail()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);

        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null)
        {
            return BadRequest();
        }
        

        if (user.EmailConfirmed)
        {
            return Conflict(new { message = "Email is already confirmed" });
        }
        
        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        _logger.LogInformation("Email token: {EmailToken}", emailToken);

        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

        _logger.LogInformation("Original token: {Token}", emailToken);
        _logger.LogInformation("Decoded token: {Encoded token}", encodedToken);


        var emailConfirmationUrl = $"http://localhost:3000/confirm-email?userId={user.Id}&token={encodedToken}";

        var innerHtmlMessage = $"""
                                <p> Hi {user.UserName} </p>
                                <p>Please click the following URL to confirm your email</p>:
                                <a href="{emailConfirmationUrl}">Click me</a>
                                """;
        var isEmailSent = true;
        try
        {
            await _emailSender.SendEmailAsync(user.Email!, "Confirm your email", innerHtmlMessage);
        }
        catch (Exception exception)
        {
            _logger.LogError("There was an error sending confirmation email: {Exception}", exception);
            isEmailSent = false;
        }


        return Ok(new AuthResponseDto
        {
            Token = "",
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed,
            EmailSent = isEmailSent
        });
        
    }
}