using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ParadigmXDrive.Server.Enums;
using ParadigmXDrive.Server.Models;
using ParadigmXDrive.Server.RequestData;

namespace ParadigmXDrive.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private static List<AppUser> Users = new List<AppUser>()
        {
            new AppUser("Admin", "Admin", UserRole.Admin)
        };

        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginPostRequest request)
        {
            var user = Users.FirstOrDefault(u =>
                u.Username == request.username &&
                u.Password == request.password);

            if (user == null)
                return Unauthorized("Invalid username or password");

            string token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role
            });
        }

        private string GenerateJwtToken(AppUser user)
        {
            string key = _config["JwtConfig:TestKey"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtConfig:Issuer"],
                audience: _config["JwtConfig:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(12),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}