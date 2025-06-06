using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.ViewModels.AppUser;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ILogger<AccountController> _logger;
    private readonly IConfiguration _config;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ILogger<AccountController> logger,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var normalizedUserName = model.UserName.ToUpperInvariant();

        var user = await _userManager.Users
            .Where(u => u.NormalizedUserName == normalizedUserName)
            .FirstOrDefaultAsync();

        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized(new { message = "Невірний логін або пароль" });
        }

        var token = GenerateJwtToken(user);

        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(60)
        });

        Response.Cookies.Append("user_id", user.Id, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(60)
        });

        Response.Cookies.Append("user_role", user.Role, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(60)
        });

        return Ok(new { user.Id, user.UserName, Role = user.Role });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new AppUser
        {
            UserName = model.UserName,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Bio = model.Bio,
            Role = "User" // за замовчуванням
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok("Користувача зареєстровано");
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("user_id");
        Response.Cookies.Delete("user_role");
        return Ok("Вихід успішний");
    }

    private string GenerateJwtToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Authorization failed: missing or invalid JWT claim 'NameIdentifier'.");
            return Unauthorized(new { error = "Unable to determine user identity." });
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found in database.", userId);
            return Unauthorized(new { error = "User not found." });
        }

        return Ok(user);
    }

}



/*
        [HttpPost("change-email")]
        [Authorize]
        public async Task<IActionResult> ChangeEmail([FromBody] RequestEmailChangeModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.NewEmail))
            {
                _logger.LogError("ChangeEmail - new email is null or empty.");
                return BadRequest("New email is required.");
            }

            // Отримання ID користувача з сесії
            var userId = HttpContext.Session.GetString("UserId");

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("ChangeEmail - user ID not found in session.");
                return Unauthorized("User not authenticated.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("ChangeEmail - user with ID {UserId} not found.", userId);
                return NotFound("User not found.");
            }

            var existingUser = await _userManager.FindByEmailAsync(model.NewEmail);
            if (existingUser != null)
            {
                _logger.LogWarning("ChangeEmail - email {Email} is already in use.", model.NewEmail);
                return BadRequest("This email is already in use.");
            }

            user.Email = model.NewEmail;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("ChangeEmail - failed to update email for user {UserName}.", user.UserName);
                foreach (var error in result.Errors)
                {
                    _logger.LogError("Error: {Error}", error.Description);
                }
                return BadRequest("Failed to update email.");
            }

            _logger.LogInformation("Email changed successfully for user {UserName}.", user.UserName);
            return Ok("Email changed successfully.");
        }

        [HttpPost("request-role-change")]
        public async Task<IActionResult> RequestRoleChange([FromBody] string requestedRole)
        {
            // Отримання ID користувача з сесії
            var userId = HttpContext.Session.GetString("UserId");

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("Failed to create role change request - user ID not found in session.");
                return Unauthorized("User not authenticated.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogError("Failed to create role change request - user not found");
                return NotFound("User not found");
            }

            if (!new[] { "Admin", "Shop" }.Contains(requestedRole, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid role requested");
            }

            if (!string.IsNullOrEmpty(user.PendingRoleChange))
            {
                _logger.LogWarning("Role change request already exists for user {UserName}", user.UserName);
                return BadRequest("You already have a pending role change request");
            }

            user.PendingRoleChange = requestedRole;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                _logger.LogError("Failed to save role change request for user {UserName}", user.UserName);
                return BadRequest("Failed to save role change request");
            }

            _logger.LogInformation("Role change request created successfully for user {UserName}", user.UserName);
            return Ok("Role change request submitted successfully");
        }

        [HttpGet("role-change-requests")]
        public async Task<IActionResult> GetRoleChangeRequests()
        {
            var userRole = HttpContext.Session.GetString("Role");

            if (string.IsNullOrEmpty(userRole) || !string.Equals(userRole, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Access denied - user is not an admin.");
                return Unauthorized("You do not have permission to perform this action.");
            }

            var usersWithPendingRequests = _userManager.Users
                .Where(u => !string.IsNullOrEmpty(u.PendingRoleChange))
                .ToList();

            if (!usersWithPendingRequests.Any())
            {
                return Ok("No role change requests found");
            }

            return Ok(usersWithPendingRequests.Select(u => new
            {
                Nickname = u.UserName,
                CurrentRole = u.Role,
                RequestedRole = u.PendingRoleChange,
                Email = u.Email
            }));
        }

        [HttpPut("approve-role-change/{nickname}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveRoleChange(string nickname)
        {
            var user = await _userManager.FindByNameAsync(nickname);

            if (user == null || string.IsNullOrEmpty(user.PendingRoleChange))
            {
                _logger.LogError("Role change request not found for user {UserName}", nickname);
                return NotFound("Role change request not found");
            }

            user.Role = user.PendingRoleChange;
            user.PendingRoleChange = null;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                _logger.LogError("Failed to approve role change for user {UserName}", nickname);
                return BadRequest("Failed to approve role change");
            }

            _logger.LogInformation("Role change request approved for user {UserName}", nickname);
            return Ok("Role change request approved successfully");
        }

        [HttpPut("reject-role-change/{nickname}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectRoleChange(string nickname)
        {
            var user = await _userManager.FindByNameAsync(nickname);

            if (user == null || string.IsNullOrEmpty(user.PendingRoleChange))
            {
                _logger.LogError("Role change request not found for user {UserName}", nickname);
                return NotFound("Role change request not found");
            }

            user.PendingRoleChange = null;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                _logger.LogError("Failed to reject role change for user {UserName}", nickname);
                return BadRequest("Failed to reject role change");
            }

            _logger.LogInformation("Role change request rejected for user {UserName}", nickname);
            return Ok("Role change request rejected successfully");
        }*/
