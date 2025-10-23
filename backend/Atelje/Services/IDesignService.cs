using Atelje.DTOs.Design;

namespace Atelje.Services;

public interface IDesignService
{
    Task<List<DesignDto>> GetAllDesignsAsync();
    Task<DesignDto?> GetDesignByIdAsync(int id);
    Task<DesignDto> CreateDesignAsync(CreateDesignDto createDesignDto);
    Task<DesignDto?> UpdateDesignAsync(int id, UpdateDesignDto updateDesignDto);
    Task<bool> DeleteDesignAsync(int id);
}