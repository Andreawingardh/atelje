namespace Atelje.DTOs.User;

public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
}