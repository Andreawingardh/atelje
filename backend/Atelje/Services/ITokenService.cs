namespace Atelje.Services;

public interface ITokenService
{
    string GenerateToken(string userId, string email);
}