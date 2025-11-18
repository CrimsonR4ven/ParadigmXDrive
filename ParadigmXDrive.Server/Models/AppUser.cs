using ParadigmXDrive.Server.Enums;

namespace ParadigmXDrive.Server.Models;

public class AppUser
{
    public string Username { get; set; }
    public string Password { get; set; }
    public UserRole Role { get; set; }

    public AppUser(string username, string password, UserRole role)
    {
        Username = username;
        Password = password;
        Role = role;
    }
}