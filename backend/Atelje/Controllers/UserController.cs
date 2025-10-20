using Atelje.DTOs.User;
using Atelje.Services;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        var users = await userService.GetAllUsersAsync();
        return users;
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var user = await userService.GetUserByIdAsync(id);

        if (user == null) return NotFound();
        return user;
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        var user = await userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(string id, UpdateUserDto dto)
    {
        var user = await userService.UpdateUserAsync(id, dto);
        if (user == null) return NotFound();
        return user;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var deleted = await userService.DeleteUserAsync(id);

        if (!deleted) return NotFound();

        return NoContent();
    }
}