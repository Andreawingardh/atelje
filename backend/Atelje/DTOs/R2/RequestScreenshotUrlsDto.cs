using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.R2
{
    public class RequestScreenshotUrlsDto
    {
        [Required]
        [StringLength(200)]
        public string FullFileName { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ThumbnailFileName { get; set; }
    }
}