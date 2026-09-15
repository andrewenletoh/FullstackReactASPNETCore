using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class RegisterRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(32)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public static UserResponse FromUser(User user) => new()
    {
        Id = user.Id ?? string.Empty,
        Username = user.Username,
        Role = user.Role
    };

}