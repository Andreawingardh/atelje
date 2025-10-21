using Atelje.DTOs;
using Atelje.DTOs.Auth;
using Atelje.Models;
using Atelje.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<User> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
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
        
        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            DisplayName = user.DisplayName
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
            DisplayName = user.DisplayName
        });

    }

}