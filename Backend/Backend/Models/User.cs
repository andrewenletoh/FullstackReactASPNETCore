using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public static class Roles

{
    public const string User = "User";
    public const string Admin = "Admin";
}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Username { get; set; } = string.Empty;

    // Never store or return the plain password - only the bcrypt hash.
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = Roles.User;

    // Only the hash of the current refresh token is stored, never the raw
    // token, so a leaked database doesn't hand out usable sessions
    public string? RefreshTokenHash { get; set; }

    public DateTime? RefreshTokenExpiresAt { get; set; }


}

