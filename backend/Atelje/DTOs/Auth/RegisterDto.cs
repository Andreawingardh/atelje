using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Auth;

public class RegisterDto
{
    [Required] [EmailAddress] public required string Email { get; set; }
    [Required] [MinLength(3)] public required string UserName { get; set; }
    [Required] [MinLength(6)] public required string Password { get; set; }
    [MaxLength(50)] public string? DisplayName { get; set; }
}