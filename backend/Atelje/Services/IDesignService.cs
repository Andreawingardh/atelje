using Atelje.DTOs.Design;

namespace Atelje.Services;

public interface IDesignService
{
    Task<List<DesignDto>> GetAllDesignsAsync();
    Task<DesignDto?> GetDesignByIdAsync(int id);
}