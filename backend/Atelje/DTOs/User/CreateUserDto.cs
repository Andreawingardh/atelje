using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.User;

/// <summary>
/// Data needed to create a new user
/// </summary>  
public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    
    [MaxLength(50)]
    public string DisplayName { get; set; }
}