namespace Atelje.DTOs.Auth;

public class EmailConfirmationDto
{
    public required string Message { get; set; }
    public required bool EmailConfirmed { get; set; }
}