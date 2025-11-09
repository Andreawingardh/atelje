using Atelje.DTOs.Design;
using Atelje.Services;
using Atelje.DTOs.R2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DesignController(IDesignService designService, IR2Service r2Service) : ControllerBase
{
    [HttpGet(Name = "GetAllDesigns")]
    public async Task<ActionResult<List<DesignDto>>> GetDesigns()
    {
        var designs = await designService.GetAllDesignsAsync();
        return designs;
    }
    
    [HttpGet("my-designs", Name = "GetMyDesigns")]
    public async Task<ActionResult<List<DesignDto>>> GetMyDesigns()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
    
        var designs = await designService.GetDesignsByUserIdAsync(userId);
        return designs;
    }

    [HttpGet("{id}", Name = "GetDesignById")]
    public async Task<ActionResult<DesignDto>> GetDesign(int id)
    {
        var design = await designService.GetDesignByIdAsync(id);

        if (design == null) return NotFound();
        return design;
    }

    [HttpPost(Name = "CreateDesign")]
    public async Task<ActionResult<DesignDto>> CreateDesign(CreateDesignDto createDesignDto)
    {
        var design = await designService.CreateDesignAsync(createDesignDto);
        return CreatedAtAction(nameof(GetDesign), new { id = design.Id }, design);
    }

    [HttpPut("{id}", Name = "UpdateDesign")]
    public async Task<ActionResult<DesignDto>> UpdateDesign(int id, UpdateDesignDto updateDesignDto)
    {
        var design = await designService.UpdateDesignAsync(id, updateDesignDto);

        if (design == null) return NotFound();

        return design;
    }

    [HttpDelete("{id}", Name = "DeleteDesign")]
    public async Task<ActionResult<DesignDto>> DeleteDesign(int id)
    {
        var deleted = await designService.DeleteDesignAsync(id);

        if (!deleted) return NotFound();

        return NoContent();
    }

    [HttpPost("screenshots/upload-urls", Name = "GetScreenshotUploadUrls")]
    public async Task<ActionResult<ScreenshotUrlsDto>> GetScreenshotUploadUrls(
        [FromBody] RequestScreenshotUrlsDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        if (!IsValidFileName(request.FullFileName) || !IsValidFileName(request.ThumbnailFileName))
        {
            return BadRequest(new { error = "Invalid file name. Only .jpg, .jpeg, and .png are allowed." });
        }

        try
        {
            var fullSizeResult = await r2Service.GeneratePresignedUploadUrl(
                request.FullFileName,
                10
            );

            var thumbnailResult = await r2Service.GeneratePresignedUploadUrl(
                request.ThumbnailFileName,
                10
            );

            var response = new ScreenshotUrlsDto
            {
                FullSizeUploadUrl = fullSizeResult.UploadUrl,
                FullSizePublicUrl = fullSizeResult.PublicUrl,
                ThumbnailUploadUrl = thumbnailResult.UploadUrl,
                ThumbnailPublicUrl = thumbnailResult.PublicUrl
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Failed to generate upload URLs",
                message = ex.Message
            });
        }
    }

    private bool IsValidFileName(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return false;

        var validExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        return validExtensions.Contains(extension);
    }
}