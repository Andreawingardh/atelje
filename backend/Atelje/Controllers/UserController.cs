using Atelje.DTOs.User;
using Atelje.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atelje.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpGet(Name = "GetAllUsers")]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        var users = await userService.GetAllUsersAsync();
        return users;
    }
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var user = await userService.GetUserByIdAsync(id);

        if (user == null) return NotFound();
        return user;
    }

    [HttpPost(Name = "CreateUser")]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        var user = await userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}", Name = "UpdateUserById")]
    public async Task<ActionResult<UserDto>> UpdateUserById(string id, UpdateUserDto dto)
    {
        var user = await userService.UpdateUserAsync(id, dto);
        if (user == null) return NotFound();
        return user;
    }

    [HttpDelete("{id}", Name = "DeleteUserById")]
    public async Task<IActionResult> DeleteUserById(string id)
    {
        var deleted = await userService.DeleteUserAsync(id);

        if (!deleted) return NotFound();

        return NoContent();
    }
}