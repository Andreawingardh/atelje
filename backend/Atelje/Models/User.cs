using Microsoft.AspNetCore.Identity;

namespace Atelje.Models;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; init; }
    public ICollection<Design>? Designs { get; init; }
}