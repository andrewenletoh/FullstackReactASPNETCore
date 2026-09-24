using Backend.Models;

namespace Backend.Services;

public record AuthResult(
    User User,
    string AccessToken,
    string RefreshToken
);