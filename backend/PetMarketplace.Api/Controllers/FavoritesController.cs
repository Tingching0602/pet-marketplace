using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos.Products;
using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FavoritesController(AppDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private static string FormatPrice(decimal price) => price == 0 ? "免費" : $"NT$ {price:0}";

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = CurrentUserId;

        var products = await _db.Favorites
            .Where(f => f.UserId == userId && f.Product.Status != ProductStatus.Sold)
            .Include(f => f.Product).ThenInclude(p => p.Category)
            .Include(f => f.Product).ThenInclude(p => p.Seller)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.Product)
            .ToListAsync();

        var items = products.Select(p => new ProductListItemDto(
            p.Id, p.Title, FormatPrice(p.Price), p.Price == 0, p.Price,
            p.Condition.ToString(), p.Status.ToString(), p.IconKind, p.BgColorHex,
            p.Category.Name, p.SellerId, p.Seller.DisplayName, p.Rating, true
        )).ToList();

        return Ok(items);
    }

    [HttpPost("{productId:int}/toggle")]
    public async Task<IActionResult> Toggle(int productId)
    {
        var userId = CurrentUserId;

        var productExists = await _db.Products.AnyAsync(p => p.Id == productId);
        if (!productExists) return NotFound();

        var existing = await _db.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
        if (existing != null)
        {
            _db.Favorites.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok(new { isFavorited = false });
        }

        _db.Favorites.Add(new Favorite { UserId = userId, ProductId = productId, CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();
        return Ok(new { isFavorited = true });
    }
}
