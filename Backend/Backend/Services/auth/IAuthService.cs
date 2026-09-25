using Backend.Dtos.Auth;
using Backend.Models;

namespace Backend.Services;

public interface IAuthService
{
    Task<AuthResult?> LoginAsync(LoginRequest request);
    Task<bool> LogoutAsync(string userId);
    Task<AuthResult?> RefreshAsync(string refreshToken);
    Task<User?> GetUserAsync(string userId);
}
