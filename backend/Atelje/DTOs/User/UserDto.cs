namespace Atelje.DTOs.User;

public class UserDto
{
    public required string Id { get; init; }
    public required string Email { get; init; }
    public required string UserName { get; init; }
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
}