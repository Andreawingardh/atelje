using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity;

namespace Atelje.Models;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Design>? Designs { get; set; }
    public DateTime? LastEmailSentAt { get; set; }
}