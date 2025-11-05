namespace Atelje.Models;

public class Design
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    
    public string DesignData { get; set; }
    public string? ScreenshotUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
}