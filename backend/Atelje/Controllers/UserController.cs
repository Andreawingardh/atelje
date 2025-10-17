using Atelje.DTOs.User;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;

public class UserController : Controller
{

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
    }
}