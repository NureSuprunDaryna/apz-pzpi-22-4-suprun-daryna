using System.Security.Claims;
using BLL.Interfaces;
using Core.Helpers;
using Core.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.ViewModels.Preferences;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PreferencesController : ControllerBase
{
    private readonly ILogger<PreferencesController> _logger;
    private readonly IPreferencesService _preferencesService;
    private readonly UserManager<AppUser> _userManager;

    public PreferencesController(ILogger<PreferencesController> logger, IPreferencesService preferencesService, UserManager<AppUser> userManager)
    {
        _logger = logger;
        _preferencesService = preferencesService;
        _userManager = userManager;
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("create")]
    public async Task<IActionResult> CreatePreferences([FromBody] CreatePreferencesModel model)
    {
        if (model == null)
        {
            _logger.LogError("Failed to create preferences - input data is null.");
            return BadRequest(new { message = "Preferences data is null." });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Unauthorized: missing user ID in token");
            return Unauthorized();
        }

        model.UserId = userId;
        var preferences = new Preferences();
        preferences.MapFrom(model);

        _logger.LogInformation("Creating preferences for user {UserId}.", model.UserId);

        var result = await _preferencesService.AddPreferences(preferences);

        if (result.IsSuccessful)
        {
            _logger.LogInformation("Preferences created successfully with ID {PreferencesId}.", result.Data.Id);
            return Ok(new { message = "Preferences created successfully.", preferencesId = result.Data.Id });
        }

        _logger.LogError("Failed to create preferences for user {UserId}.", model.UserId);
        return BadRequest(new { message = "Failed to create preferences." });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPut("update")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesModel model)
    {
        if (model == null)
        {
            _logger.LogError("Failed to update preferences - input data is null.");
            return BadRequest(new { message = "Preferences data is null." });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Unauthorized: missing user ID in token");
            return Unauthorized();
        }

        model.UserId = userId;
        var preferences = new Preferences();
        preferences.MapFrom(model);

        _logger.LogInformation("Updating preferences for user {UserId}.", model.UserId);

        var result = await _preferencesService.UpdatePreferences(preferences);

        if (!result.IsSuccessful)
        {
            _logger.LogError("Failed to update preferences for user {UserId}.", model.UserId);
            return BadRequest(new { message = "Failed to update preferences." });
        }

        _logger.LogInformation("Preferences updated successfully for user {UserId}.", model.UserId);
        return Ok(new { message = "Preferences updated successfully." });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeletePreferences(int id)
    {
        if (id <= 0)
        {
            _logger.LogError("Failed to delete preferences - invalid ID provided: {Id}.", id);
            return BadRequest(new { message = "Invalid preferences ID." });
        }

        _logger.LogInformation("Deleting preferences with ID {Id}.", id);

        var result = await _preferencesService.DeletePreferences(id);

        if (!result.IsSuccessful)
        {
            _logger.LogError("Failed to delete preferences with ID {Id}.", id);
            return BadRequest(new { message = "Failed to delete preferences." });
        }

        _logger.LogInformation("Preferences with ID {Id} deleted successfully.", id);
        return Ok(new { message = "Preferences deleted successfully." });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetPreferencesByUser(string userId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserId))
        {
            _logger.LogWarning("Unauthorized access attempt to fetch preferences.");
            return Unauthorized(new { message = "You are not authorized to access this resource." });
        }

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
        {
            _logger.LogWarning("User with ID {UserId} not found.", currentUserId);
            return Unauthorized(new { message = "User not found." });
        }

        if (currentUser.Id != userId && currentUser.Role != "Admin" && currentUser.Role != "AdminDB")
        {
            _logger.LogWarning("Access denied for user {UserName} to fetch preferences of user {TargetUserId}.", currentUser.UserName, userId);
            return Forbid();
        }

        _logger.LogInformation("User {UserName} is fetching preferences for user {UserId}.", currentUser.UserName, userId);

        var result = await _preferencesService.GetPreferencesByUser(userId);

        if (!result.IsSuccessful || result.Data == null)
        {
            _logger.LogWarning("No preferences found for user {UserId}.", userId);
            return NotFound(new { message = "No preferences found for the user." });
        }

        var viewModel = new PreferencesViewModel();
        viewModel.MapFrom(result.Data);

        _logger.LogInformation("Preferences fetched successfully for user {UserId}.", userId);
        return Ok(viewModel);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("user")]
    public async Task<IActionResult> GetCurrentUserPreferences()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _preferencesService.GetPreferencesByUser(userId);
        if (!result.IsSuccessful || result.Data == null)
            return NotFound(new { message = "No preferences found." });

        var viewModel = new PreferencesViewModel();
        viewModel.MapFrom(result.Data);

        return Ok(viewModel);
    }

}


/*
[HttpGet("elixir/{elixirId}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetPreferencesByElixir(int elixirId)
{
    if (elixirId <= 0)
    {
        _logger.LogError("Failed to fetch preferences - invalid elixir ID provided: {ElixirId}.", elixirId);
        return BadRequest(new { message = "Invalid elixir ID." });
    }

    _logger.LogInformation("Fetching preferences for elixir with ID {ElixirId}.", elixirId);

    var result = await _preferencesService.GetPreferencesByElixir(elixirId);

    if (!result.IsSuccessful || result.Data == null)
    {
        _logger.LogWarning("No preferences found for elixir with ID {ElixirId}.", elixirId);
        return NotFound(new { message = "No preferences found for the elixir." });
    }

    var viewModel = new PreferencesViewModel();
    viewModel.MapFrom(result.Data);

    _logger.LogInformation("Preferences fetched successfully for elixir with ID {ElixirId}.", elixirId);
    return Ok(viewModel);
}
*/