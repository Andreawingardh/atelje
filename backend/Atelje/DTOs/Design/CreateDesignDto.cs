using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Design;

/// <summary>
/// Data needed to create a new user
/// </summary>
public class CreateDesignDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(25)]
    public required string Name { get; set; }
    
    [Required]
    [MaxLength(100)]
    public required string UserId { get; set; }
    
    [Required]
    [MinLength(3)]
    public required string DesignData { get; set; }
    
    [Url]
    [MaxLength(500)]
    public string? ScreenshotUrl { get; set; }
    
    [Url]
    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }
}