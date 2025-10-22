using Atelje.DTOs.Design;
using Atelje.Services;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
public class DesignController(IDesignService designService) : ControllerBase
{
    [HttpGet(Name = "GetAllDesigns")]
    public async Task<ActionResult<List<DesignDto>>> GetDesigns()
    {
        var designs = await designService.GetAllDesignsAsync();
        return designs;
    }

    [HttpGet("{id}", Name = "GetDesignById")]
    public async Task<ActionResult<DesignDto>> GetDesign(int id)
    {
        var design = await designService.GetDesignByIdAsync(id);

        if (design == null) return NotFound();
        return design;
    }
}