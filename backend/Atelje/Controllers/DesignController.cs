// using Atelje.DTOs.Design;
// using Atelje.Services;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
public class DesignController : ControllerBase
{
    // public DesignController(IDesignService designService)
    // {
    // }
    
    [HttpGet(Name = "GetAllDesigns")]
    public async Task<ActionResult<List<object>>> GetDesigns()
    {
        throw new NotImplementedException();
    }

    [HttpGet("{id}", Name = "GetDesignByID")]
    public async Task<ActionResult<object>> GetDesign(string id)
    {
        throw new NotImplementedException();
    }
}