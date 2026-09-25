using Backend.Dtos.Auth;
using Backend.Models;

namespace Backend.Services.Auth;

public interface IAuthService
{
    Task<AuthResult?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<bool> LogoutAsync(string userId, CancellationToken cancellationToken = default);
    Task<AuthResult?> RefreshAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<User?> GetUserAsync(string userId, CancellationToken cancellationToken = default);
}
