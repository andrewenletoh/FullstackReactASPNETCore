using Backend.Models;

namespace Backend.Dtos.Auth;

public record UserResponse(

    string Id,
    string Username,
    string Role
)
{
    public static UserResponse FromUser(User user)
    {
        if (string.IsNullOrEmpty(user.Id))
        {
            throw new InvalidOperationException("User ID is missing.");
        }

        return new UserResponse(
            user.Id,
            user.Username,
            user.Role
        );
    }
}