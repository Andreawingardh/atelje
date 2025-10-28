namespace Atelje.DTOs.Auth;

public class AuthResponseDto
{
        public required string Token { get; init; }
        public required string UserId { get; set; }
        public required string Email { get; init; }
        public required string UserName { get; init; }
        public string? DisplayName { get; set; }
}