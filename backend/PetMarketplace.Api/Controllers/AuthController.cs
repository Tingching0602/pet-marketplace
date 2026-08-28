using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PetMarketplace.Api.Dtos.Auth;
using PetMarketplace.Api.Models.Entities;
using PetMarketplace.Api.Services;
using System.Security.Claims;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.DisplayName))
        {
            return BadRequest(new { message = "Email、密碼、暱稱皆為必填。" });
        }

        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
        {
            return Conflict(new { message = "此 Email 已被註冊。" });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user);
        return Created(string.Empty, new AuthResponse(
            token,
            expiresAt,
            new UserSummaryDto(user.Id, user.Email!, user.DisplayName, user.AvatarColorHex)
        ));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new { message = "帳號或密碼錯誤。" });
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(
            token,
            expiresAt,
            new UserSummaryDto(user.Id, user.Email!, user.DisplayName, user.AvatarColorHex)
        ));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        return Ok(new UserSummaryDto(user.Id, user.Email!, user.DisplayName, user.AvatarColorHex));
    }
}
