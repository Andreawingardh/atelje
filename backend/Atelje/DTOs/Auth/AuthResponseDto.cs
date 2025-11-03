namespace Atelje.DTOs.Auth;

public class AuthResponseDto
{
        public required string Token { get; set; }
        public required string UserId { get; set; }
        public required string Email { get; set; }
        public required string UserName { get; set; }
        public string? DisplayName { get; set; }
        public bool EmailConfirmed { get; set; }
}