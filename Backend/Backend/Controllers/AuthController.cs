using System.IdentityModel.Tokens.Jwt;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private const string AccessCookieName = "access_token";
    private const string RefreshCookieName = "refresh_token";
    private const string RefreshCookiePath = "/api/auth/refresh";

    private readonly IAuthService _authService;
    private readonly JwtService _jwt;
    private readonly IWebHostEnvironment _env;

    public AuthController(IAuthService authService, JwtService jwt, IWebHostEnvironment env)
    {
        _authService = authService;
        _jwt = jwt;
        _env = env;
    }

    private void SetAuthCookies(string accessToken, string refreshToken)
    {
        var isProd = _env.IsProduction();

        Response.Cookies.Append(AccessCookieName, accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProd,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddMinutes(_jwt.AccessTokenMinutes)
        });

        Response.Cookies.Append(RefreshCookieName, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProd,
            SameSite = SameSiteMode.Lax,
            // Scoped so the browser only ever sends this cookie to the
            // refresh endpoint, never on regular API calls.
            Path = RefreshCookiePath,
            Expires = DateTimeOffset.UtcNow.AddDays(_jwt.RefreshTokenDays)
        });
    }

    private void ClearAuthCookies()
    {
        Response.Cookies.Delete(AccessCookieName, new CookieOptions { Path = "/" });
        Response.Cookies.Delete(RefreshCookieName, new CookieOptions { Path = RefreshCookiePath });
    }

    // [HttpPost("register")] // POST /api/auth/register
    // public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    // {
    //     var username = request.Username.Trim();

    //     var existing = await _context.Users.Find(u => u.Username == username).FirstOrDefaultAsync();
    //     if (existing is not null)
    //     {
    //         return Conflict(new { message = "Username is already taken." });
    //     }

    //     var user = new User
    //     {
    //         Username = username,
    //         PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
    //         Role = Roles.User
    //     };

    //     await _context.Users.InsertOneAsync(user);
    //     await IssueTokensAsync(user);

    //     return Ok(UserResponse.FromUser(user));
    // }

    [HttpPost("login")] // POST /api/auth/login
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (result is null)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }
        SetAuthCookies(result.AccessToken, result.RefreshToken);
        return Ok(UserResponse.FromUser(result.User));
    }

    [HttpPost("logout")] // POST /api/auth/logout
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await _authService.LogoutAsync(userId);
        }
        ClearAuthCookies();
        return NoContent();
    }

    [HttpPost("refresh")] // POST /api/auth/refresh
    public async Task<IActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue(
            RefreshCookieName,
            out var refreshToken) ||
            string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { message = "Missing refresh token." });
        }

        var result = await _authService.RefreshAsync(refreshToken);
        if (result is null)
        {
            ClearAuthCookies();

            return Unauthorized(
                new { message = "Refresh token is invalid or expired." }
            );
        }
        SetAuthCookies(result.AccessToken, result.RefreshToken);
        return Ok(UserResponse.FromUser(result.User));
    }

    [HttpGet("me")] // GET /api/auth/me
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var user = await _authService.GetUserAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }
        return Ok(UserResponse.FromUser(user));
    }
}

