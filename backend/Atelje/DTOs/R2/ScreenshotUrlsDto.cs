namespace Atelje.DTOs.R2
{
    public class ScreenshotUrlsDto
    {
        public required string FullSizeUploadUrl { get; set; }
        public required string ThumbnailUploadUrl { get; set; }
        public required string FullSizePublicUrl { get; set; }
        public required string ThumbnailPublicUrl { get; set; }
    }
}