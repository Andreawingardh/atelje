using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.User;


/// <summary>
/// Data needed to update a user
/// </summary>  

public class UpdateUserDto
{
    [MaxLength(50)]
    public string? DisplayName { get; set; }
}