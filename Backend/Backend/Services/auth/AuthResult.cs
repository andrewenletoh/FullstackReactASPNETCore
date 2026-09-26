using Backend.Models;

namespace Backend.Services.Auth;

public record AuthResult(
    User User,
    string AccessToken,
    string RefreshToken
);