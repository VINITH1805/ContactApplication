using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyContactAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace MyContactAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(MyDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            
        }

        [HttpGet("CheckNameExists")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> CheckNameExists(string Username)
        {
            bool nameExists = await _context.Users.AnyAsync(c => c.Username == Username);
            return Ok(new { exists = nameExists });
        }

        [HttpPost("register")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> Register(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful" });
        }
        
        [HttpPost("login")]
        [EnableCors("alloworigin")]

        public async Task<IActionResult> Login(User user)
        {
            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username && u.Password == user.Password);

                if (existingUser == null)
                    return Unauthorized();

                var token = GenerateJwtToken(existingUser);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
