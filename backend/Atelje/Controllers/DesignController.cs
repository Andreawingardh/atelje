using Atelje.DTOs.Design;
using Atelje.Services;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
// [Authorize]
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
}