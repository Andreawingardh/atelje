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
    private readonly IWebHostEnvironment _env;

    public AuthController(UserManager<User> userManager, ITokenService tokenService, IEmailSender emailSender,
        ILogger<AuthController> logger, IWebHostEnvironment env)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailSender = emailSender;
        _logger = logger;
        _env = env;
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


        var baseUrl = _env.IsDevelopment() ? "https://localhost:3000" : "https://www.atelje.app";
        var emailConfirmationUrl = $"{baseUrl}/confirm-email?userId={user.Id}&token={encodedToken}";

        var innerHtmlMessage = $"""
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link rel="preconnect" href="https://fonts.googleapis.com">
                                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                                </head>
                                <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                                        <tr>
                                            <td align="center">
                                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                    <!-- Header -->
                                                    <tr>
                                                        <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #9D4A31; border-radius: 8px 8px 0 0;">
                                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; font-family: 'Poppins', sans-serif;">Welcome to Atelje!</h1>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Body -->
                                                    <tr>
                                                        <td style="padding: 40px;">
                                                            <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                Hi <strong>{user.UserName}</strong>,
                                                            </p>
                                                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                Thank you for signing up! To complete your registration, please confirm your email address by clicking the button below.
                                                            </p>
                                                            
                                                            <!-- CTA Button -->
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center" style="padding: 20px 0;">
                                                                        <a href="{emailConfirmationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #9D4A31; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; font-family: 'Poppins', sans-serif;">Confirm Email Address</a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                If the button doesn't work, copy and paste this link into your browser:
                                                            </p>
                                                            <p style="margin: 8px 0 0 0; word-break: break-all; font-family: 'Poppins', sans-serif;">
                                                                <a href="{emailConfirmationUrl}" style="color: #9D4A31; text-decoration: underline; font-size: 14px;">{emailConfirmationUrl}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Footer -->
                                                    <tr>
                                                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; font-family: 'Poppins', sans-serif;">
                                                                If you didn't create an account with Atelje, you can safely ignore this email.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                                </html>
                                """;

        try
        {
            await _emailSender.SendEmailAsync(user.Email, "Confirm your email", innerHtmlMessage);
        }
        catch (Exception exception)
        {
            _logger.LogError("There was an error sending confirmation email: {Exception}", exception);
        }

        user.LastEmailSentAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);


        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed,
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

        if (user.LastEmailSentAt.HasValue &&
            (DateTime.UtcNow - user.LastEmailSentAt.Value).TotalMinutes < 2)
        {
            return BadRequest((new ErrorResponseDto
                { Errors = ["Please wait 2 minutes before requesting another email"] }));
        }

        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        _logger.LogInformation("Email token: {EmailToken}", emailToken);

        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

        _logger.LogInformation("Original token: {Token}", emailToken);
        _logger.LogInformation("Decoded token: {Encoded token}", encodedToken);

        var baseUrl = _env.IsDevelopment() ? "https://localhost:3000" : "https://www.atelje.app";
        var emailConfirmationUrl = $"{baseUrl}/confirm-email?userId={user.Id}&token={encodedToken}";
        var innerHtmlMessage = $"""
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link rel="preconnect" href="https://fonts.googleapis.com">
                                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                                </head>
                                <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                                        <tr>
                                            <td align="center">
                                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                    <!-- Header -->
                                                    <tr>
                                                        <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #9D4A31; border-radius: 8px 8px 0 0;">
                                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; font-family: 'Poppins', sans-serif;">Welcome to Atelje!</h1>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Body -->
                                                    <tr>
                                                        <td style="padding: 40px;">
                                                            <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                Hi <strong>{user.UserName}</strong>,
                                                            </p>
                                                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                Thank you for signing up! To complete your registration, please confirm your email address by clicking the button below.
                                                            </p>
                                                            
                                                            <!-- CTA Button -->
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center" style="padding: 20px 0;">
                                                                        <a href="{emailConfirmationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #9D4A31; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; font-family: 'Poppins', sans-serif;">Confirm Email Address</a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; font-family: 'Poppins', sans-serif;">
                                                                If the button doesn't work, copy and paste this link into your browser:
                                                            </p>
                                                            <p style="margin: 8px 0 0 0; word-break: break-all; font-family: 'Poppins', sans-serif;">
                                                                <a href="{emailConfirmationUrl}" style="color: #9D4A31; text-decoration: underline; font-size: 14px;">{emailConfirmationUrl}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Footer -->
                                                    <tr>
                                                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; font-family: 'Poppins', sans-serif;">
                                                                If you didn't create an account with Atelje, you can safely ignore this email.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                                </html>
                                """;
        try
        {
            await _emailSender.SendEmailAsync(user.Email!, "Confirm your email", innerHtmlMessage);
        }
        catch (Exception exception)
        {
            _logger.LogError("There was an error sending confirmation email: {Exception}", exception);
        }

        user.LastEmailSentAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);


        return Ok(new AuthResponseDto
        {
            Token = "",
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName,
            EmailConfirmed = user.EmailConfirmed,
        });
    }
}