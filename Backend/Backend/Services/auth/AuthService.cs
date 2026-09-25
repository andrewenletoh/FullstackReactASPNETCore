using Backend.Dtos.Auth;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly MongoDBContext _context;
    private readonly JwtService _jwt;

    public AuthService(MongoDBContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    public async Task<AuthResult?> LoginAsync(LoginRequest request)
    {
        var username = request.Username.Trim();

        var user = await _context.Users
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return await CreateAuthResultAsync(user);
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        var update = Builders<User>.Update
            .Set(u => u.RefreshTokenHash, null)
            .Set(u => u.RefreshTokenExpiresAt, null);

        var result = await _context.Users.UpdateOneAsync(
            u => u.Id == userId,
            update
        );

        return result.MatchedCount > 0;
    }

    public async Task<AuthResult?> RefreshAsync(string refreshToken)
    {
        var hash = JwtService.HashRefreshToken(refreshToken);

        var user = await _context.Users
            .Find(u =>
                u.RefreshTokenHash == hash &&
                u.RefreshTokenExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync();

        if (user is null)
        {
            return null;
        }

        return await CreateAuthResultAsync(user);
    }

    public async Task<User?> GetUserAsync(string userId)
    {
        return await _context.Users
            .Find(u => u.Id == userId)
            .FirstOrDefaultAsync();
    }

    private async Task<AuthResult> CreateAuthResultAsync(User user)
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
            update
        );

        return new AuthResult(
            user,
            accessToken,
            refreshToken
        );
    }
}