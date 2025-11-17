using Atelje.Data;
using Atelje.DTOs.User;
using Atelje.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Atelje.Services;

public class UserService(AppDbContext context, UserManager<User> userManager) : IUserService
{
    private readonly AppDbContext _context = context;
    private readonly UserManager<User> _userManager = userManager;

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserDto()
            {
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(string id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            CreatedAt = user.CreatedAt,
            DisplayName = user.DisplayName
        };
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            UserName = dto.UserName,
            DisplayName = dto.DisplayName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }
        
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            DisplayName = user.DisplayName,
            CreatedAt = user.CreatedAt
        };

    }

    public async Task<UserDto> UpdateUserAsync(string id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return null;

        user.DisplayName = dto.DisplayName;

        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            DisplayName = user.DisplayName,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null) return false;

        var result = await _userManager.DeleteAsync(user);

        return result.Succeeded;

    }
}