using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos;
using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        var activeListings = await _db.Products.CountAsync(p => p.SellerId == userId && p.Status == ProductStatus.Active);
        var sold = await _db.Products.CountAsync(p => p.SellerId == userId && p.Status == ProductStatus.Sold);
        var favorites = await _db.Favorites.CountAsync(f => f.UserId == userId);

        return Ok(new ProfileDto(
            user.DisplayName,
            user.AvatarColorHex,
            new ProfileStatsDto(activeListings, favorites, sold)
        ));
    }
}
