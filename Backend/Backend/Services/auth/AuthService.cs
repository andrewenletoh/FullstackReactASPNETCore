using Backend.Dtos.Auth;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services.Auth;

public sealed class AuthService : IAuthService
{
    private readonly MongoDBContext _context;
    private readonly JwtService _jwt;

    public AuthService(MongoDBContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    public async Task<AuthResult?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var username = request.Username.Trim();

        var user = await _context.Users
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return await CreateAuthResultAsync(user, cancellationToken);
    }

    public async Task<bool> LogoutAsync(string userId, CancellationToken cancellationToken = default)
    {
        var update = Builders<User>.Update
            .Set(u => u.RefreshTokenHash, null)
            .Set(u => u.RefreshTokenExpiresAt, null);

        var result = await _context.Users.UpdateOneAsync(
            u => u.Id == userId,
            update,
            cancellationToken: cancellationToken
        );

        return result.MatchedCount > 0;
    }

    public async Task<AuthResult?> RefreshAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var hash = JwtService.HashRefreshToken(refreshToken);

        var user = await _context.Users
            .Find(u =>
                u.RefreshTokenHash == hash &&
                u.RefreshTokenExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return null;
        }

        return await CreateAuthResultAsync(user, cancellationToken);
    }

    public async Task<User?> GetUserAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Users
            .Find(u => u.Id == userId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task<AuthResult> CreateAuthResultAsync(User user, CancellationToken cancellationToken = default)
    {
        var accessToken = _jwt.CreateAccessToken(user);
        var refreshToken = JwtService.CreateRefreshToken();

        var update = Builders<User>.Update
            .Set(
                u => u.RefreshTokenHash,
                JwtService.HashRefreshToken(refreshToken)
            )
            .Set(
                u => u.RefreshTokenExpiresAt,
                DateTime.UtcNow.AddDays(_jwt.RefreshTokenDays)
            );

        await _context.Users.UpdateOneAsync(
            u => u.Id == user.Id,
            update,
            cancellationToken: cancellationToken
        );

        return new AuthResult(
            user,
            accessToken,
            refreshToken
        );
    }
}