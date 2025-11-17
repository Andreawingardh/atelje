using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Design;

/// <summary>
/// Data needed to update a user
/// </summary>
public class UpdateDesignDto
{
    [MaxLength(50)]
    public string? Name { get; set; }
    
    [MinLength(3)]
    public string? DesignData { get; set; }
    
    [Url]
    [MaxLength(500)]
    public string? ScreenshotUrl { get; set; }
    
    [Url]
    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }
}