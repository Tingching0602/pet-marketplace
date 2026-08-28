using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos.Products;
using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    private string? CurrentUserId => User.Identity?.IsAuthenticated == true
        ? User.FindFirstValue(ClaimTypes.NameIdentifier)
        : null;

    private static string FormatPrice(decimal price) => price == 0 ? "免費" : $"NT$ {price:0}";

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? tab,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = CurrentUserId;
        var favoritedIds = userId != null
            ? await _db.Favorites.Where(f => f.UserId == userId).Select(f => f.ProductId).ToListAsync()
            : new List<int>();

        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.Seller)
            .Where(p => p.Status != ProductStatus.Sold)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && category != "全部")
        {
            query = query.Where(p => p.Category.Name == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim();
            query = query.Where(p =>
                p.Title.Contains(q) ||
                p.Category.Name.Contains(q) ||
                p.Seller.DisplayName.Contains(q));
        }
        else
        {
            switch (tab)
            {
                case "free":
                    query = query.Where(p => p.Price == 0);
                    break;
                case "new":
                    query = query.Where(p => p.Price > 0).OrderByDescending(p => p.CreatedAt);
                    break;
                case "hot":
                default:
                    query = query.Where(p => p.Price > 0).OrderByDescending(p => p.Rating);
                    break;
            }
        }

        var total = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = products.Select(p => new ProductListItemDto(
            p.Id, p.Title, FormatPrice(p.Price), p.Price == 0, p.Price,
            p.Condition.ToString(), p.Status.ToString(), p.IconKind, p.BgColorHex,
            p.Category.Name, p.SellerId, p.Seller.DisplayName, p.Rating,
            favoritedIds.Contains(p.Id)
        )).ToList();

        return Ok(new ProductListResponse(items, total));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = CurrentUserId;
        var product = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Seller)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();

        var isFavorited = userId != null &&
            await _db.Favorites.AnyAsync(f => f.UserId == userId && f.ProductId == id);

        return Ok(new ProductDto(
            product.Id, product.Title, product.Description,
            FormatPrice(product.Price), product.Price == 0, product.Price,
            product.Condition.ToString(), product.Status.ToString(), product.ImageUrl,
            product.IconKind, product.BgColorHex,
            product.CategoryId, product.Category.Name,
            product.SellerId, product.Seller.DisplayName, product.Seller.AvatarColorHex,
            product.Rating, isFavorited, product.CreatedAt
        ));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.Title) || request.CategoryId <= 0)
        {
            return BadRequest(new { message = "商品名稱與分類為必填。" });
        }

        if (!Enum.TryParse<ProductCondition>(request.Condition, ignoreCase: true, out var condition))
        {
            return BadRequest(new { message = "商品狀況必須是 New 或 Used。" });
        }

        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists) return BadRequest(new { message = "分類不存在。" });

        var product = new Product
        {
            Title = request.Title,
            Description = request.Description,
            CategoryId = request.CategoryId,
            Condition = condition,
            Price = request.Price < 0 ? 0 : request.Price,
            IconKind = string.IsNullOrWhiteSpace(request.IconKind) ? "bowl" : request.IconKind,
            ImageUrl = request.ImageUrl,
            BgColorHex = "#DCEEE5",
            SellerId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        await _db.Entry(product).Reference(p => p.Category).LoadAsync();
        await _db.Entry(product).Reference(p => p.Seller).LoadAsync();

        return Created($"/api/products/{product.Id}", new ProductDto(
            product.Id, product.Title, product.Description,
            FormatPrice(product.Price), product.Price == 0, product.Price,
            product.Condition.ToString(), product.Status.ToString(), product.ImageUrl,
            product.IconKind, product.BgColorHex,
            product.CategoryId, product.Category.Name,
            product.SellerId, product.Seller.DisplayName, product.Seller.AvatarColorHex,
            product.Rating, false, product.CreatedAt
        ));
    }

    [HttpPatch("{id:int}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, UpdateProductStatusRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound();

        if (!Enum.TryParse<ProductStatus>(request.Status, ignoreCase: true, out var status))
        {
            return BadRequest(new { message = "狀態必須是 Active、Reserved 或 Sold。" });
        }

        var isOwner = product.SellerId == userId;
        var isBuyerReserveRequest = !isOwner && status == ProductStatus.Reserved && product.Status == ProductStatus.Active;

        if (!isOwner && !isBuyerReserveRequest)
        {
            return Forbid();
        }

        product.Status = status;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { product.Id, Status = product.Status.ToString() });
    }
}
