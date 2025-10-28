using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Auth;

public class LoginDto
{
    [Required] [EmailAddress] public required string Email { get; init; }
    [Required] public required string Password { get; init; } = string.Empty;

}   