using System.ComponentModel.DataAnnotations;

namespace Atelje.DTOs.Design;

/// <summary>
/// Data needed to update a user
/// </summary>
public class UpdateDesignDto
{
    [Required]
    [MaxLength(50)]
    public required string Name { get; set; }
}