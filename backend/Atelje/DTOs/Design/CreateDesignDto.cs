using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Design;

/// <summary>
/// Data needed to create a new user
/// </summary>
public class CreateDesignDto
{
    [Required]
    [MinLength(3)]
    public required string Name { get; set; }
    
    [MaxLength(100)]
    public string? UserId { get; set; }
}