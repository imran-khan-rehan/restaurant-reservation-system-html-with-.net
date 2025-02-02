using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restuarant_management_system.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] AuthRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already exists" });
        }

        // Check if this is the first user
        bool isFirstUser = !await _context.Users.AnyAsync();

        // Hash password
        string passwordHash = request.Password;
        var user = new User
        {
            Email = request.Email,
            Password = passwordHash,
            Role = isFirstUser ? "Admin" : "User", // Make first user Admin
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Registration successful",
            role = user.Role // Return role in response
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !VerifyPassword(request.Password, user.Password))
        {
            return BadRequest(new { message = "Invalid email or password" });
        }

        return Ok(new
        {
            message = "Login successful",
            role = user.Role,
            id = user.Id
        });
    }

    private bool VerifyPassword(string password, string hash)
    {
        return password == hash;
    }
}