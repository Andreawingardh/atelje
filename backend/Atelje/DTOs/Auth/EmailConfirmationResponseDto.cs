namespace Atelje.DTOs.Auth;

public class EmailConfirmationResponseDto
{
    public required string Message { get; set; }
    public required bool EmailConfirmed { get; set; }
}