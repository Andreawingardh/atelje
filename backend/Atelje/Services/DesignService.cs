using Atelje.Data;
using Atelje.DTOs.Design;
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
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt,
            UserId = design.UserId
        };
    }   
}