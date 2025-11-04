using Atelje.DTOs;

namespace Atelje.Services;

public interface IR2Service
{
    Task<PresignedUrlResponseDto> GeneratePresignedUploadUrl(string fileName, int expiryMinutes);
    string GetPublicUrl(string fileName);
}