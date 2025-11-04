using Amazon.S3;
using Amazon.S3.Model;
using Atelje.DTOs;

namespace Atelje.Services;

public class R2Service : IR2Service
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _bucketName;
    private readonly string _publicUrl;

    public R2Service(IConfiguration configuration)
    {
        var accountId = configuration["CloudflareR2:AccountId"];
        var accessKey = configuration["CloudflareR2:AccessKey"];
        var secretKey = configuration["CloudflareR2:SecretKey"];
        _bucketName = configuration["CloudflareR2:BucketName"];
        _publicUrl = configuration["CloudflareR2:PublicUrl"];
        
        var s3Config = new AmazonS3Config
        {
            ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com"
        };
        
        _s3Client = new AmazonS3Client(accessKey, secretKey, s3Config);
    }
    
    public async Task<PresignedUrlResponse> GeneratePresignedUploadUrl(string fileName, int expiryMinutes)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
        
        var uploadUrl = _s3Client.GetPreSignedURL(request);
        return new PresignedUrlResponse
        {
            UploadUrl = uploadUrl,
            PublicUrl = GetPublicUrl(fileName)
        };
    }
    
    public string GetPublicUrl(string fileName)
    {
        return $"{_publicUrl}/{fileName}";
    }
}