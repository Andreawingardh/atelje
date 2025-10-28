namespace Atelje.DTOs.Design;

public class DesignDto
{
    public required int Id { get; init; }
    public string? Name { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public required string UserId { get; init; }
    public required string DesignData { get; set; }
}