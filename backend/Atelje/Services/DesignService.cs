using Atelje.Data;
using Atelje.DTOs.Design;
using Atelje.Models;
using Microsoft.EntityFrameworkCore;

namespace Atelje.Services;

public class DesignService(AppDbContext context) : IDesignService
{
    private readonly AppDbContext _context = context;

    public async Task<List<DesignDto>> GetAllDesignsAsync()
    {
        return await _context.Designs
            .Select(d => new DesignDto
            {
                Id = d.Id,
                Name = d.Name,
                DesignData = d.DesignData,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt,
                UserId = d.UserId
            })
            .ToListAsync();
    }

    public async Task<DesignDto?> GetDesignByIdAsync(int id)
    {
        var design = await _context.Designs.FindAsync(id);
        
        if (design == null) return null;
        
        return new DesignDto
        {
            Id = design.Id,
            Name = design.Name,
            DesignData = design.DesignData,
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt,
            UserId = design.UserId
        };
    }   
    
    public async Task<DesignDto> CreateDesignAsync(CreateDesignDto createDesignDto)
    {
        var design = new Design
        {
            Name = createDesignDto.Name,
            DesignData = createDesignDto.DesignData,
            UserId = createDesignDto.UserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Designs.Add(design);
        await _context.SaveChangesAsync();

        return new DesignDto
        {
            Id = design.Id,
            Name = design.Name,
            DesignData = design.DesignData,
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt,
            UserId = design.UserId
        };
    }
    
    public async Task<DesignDto?> UpdateDesignAsync(int id, UpdateDesignDto updateDesignDto)
    {
        var design = await _context.Designs.FindAsync(id);
        
        if (design == null) return null;

        design.Name = updateDesignDto.Name ?? design.Name;
        design.DesignData = updateDesignDto.DesignData ?? design.DesignData;
        design.ScreenshotUrl = updateDesignDto.ScreenshotUrl ?? design.ScreenshotUrl;
        design.ThumbnailUrl = updateDesignDto.ThumbnailUrl ?? design.ThumbnailUrl;
        design.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new DesignDto
        {
            Id = design.Id,
            Name = design.Name,
            DesignData = design.DesignData,
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt,
            UserId = design.UserId,
            ScreenshotUrl = design.ScreenshotUrl,
            ThumbnailUrl = design.ThumbnailUrl
        };
    }
    
    public async Task<bool> DeleteDesignAsync(int id)
    {
        var design = await _context.Designs.FindAsync(id);
        
        if (design == null) return false;

        _context.Designs.Remove(design);
        await _context.SaveChangesAsync();
        
        return true;
    }
}