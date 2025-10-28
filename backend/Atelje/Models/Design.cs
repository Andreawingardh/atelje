using System.Diagnostics.CodeAnalysis;

namespace Atelje.Models;

public class Design
{
    
    public int Id { get; init; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public required string UserId { get; init; }
    public User User { get; init; } = null!;

    //This warning is because C# doesn't understand that this is controlled by the database
    public required string DesignData { get; set; }
}