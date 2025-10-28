using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.User;

/// <summary>
/// Data needed to create a new user
/// </summary>  
public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }
    
    [Required]
    [MinLength(3)]
    public required string UserName { get; init; }
    
    [Required]
    [MinLength(6)]
    public required string Password { get; init; }
    
    [MaxLength(50)]
    public string? DisplayName { get; init; }
}