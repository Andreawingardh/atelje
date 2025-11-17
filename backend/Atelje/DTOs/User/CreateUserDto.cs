using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.User;

/// <summary>
/// Data needed to create a new user
/// </summary>  
public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    
    [Required]
    [MinLength(3)]
    [MaxLength(25)]
    public required string UserName { get; set; }
    
    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
    
    [MaxLength(50)]
    public string? DisplayName { get; set; }
}