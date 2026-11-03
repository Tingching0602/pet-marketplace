using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos.Conversations;
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

    private static List<Category> SortedCategories(Product p) =>
        p.Categories.OrderBy(c => c.DisplayOrder).ToList();

    private static ProductDto ToDto(Product product, bool isFavorited)
    {
        var categories = SortedCategories(product);
        return new ProductDto(
            product.Id, product.Title, product.Description,
            FormatPrice(product.Price), product.Price == 0, product.Price,
            product.Condition.ToString(), product.Status.ToString(), product.ImageUrl,
            product.IconKind, product.BgColorHex,
            categories.Select(c => c.Id).ToList(), categories.Select(c => c.Name).ToList(),
            product.SellerId, product.Seller.DisplayName, product.Seller.AvatarColorHex,
            product.Rating, isFavorited, product.CreatedAt
        );
    }

    // Returns null when the list is empty or contains an unknown category id.
    private async Task<List<Category>?> LoadCategoriesAsync(List<int>? categoryIds)
    {
        var ids = categoryIds?.Distinct().ToList() ?? new List<int>();
        if (ids.Count == 0) return null;

        var categories = await _db.Categories.Where(c => ids.Contains(c.Id)).ToListAsync();
        return categories.Count == ids.Count ? categories : null;
    }

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
            .Include(p => p.Categories)
            .Include(p => p.Seller)
            .Where(p => p.Status != ProductStatus.Sold && p.Status != ProductStatus.Delisted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && category != "全部")
        {
            query = query.Where(p => p.Categories.Any(c => c.Name == category));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim();
            query = query.Where(p =>
                p.Title.Contains(q) ||
                p.Categories.Any(c => c.Name.Contains(q)) ||
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
            SortedCategories(p).Select(c => c.Name).ToList(), p.SellerId, p.Seller.DisplayName, p.Rating,
            favoritedIds.Contains(p.Id)
        )).ToList();

        return Ok(new ProductListResponse(items, total));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = CurrentUserId;
        var product = await _db.Products
            .Include(p => p.Categories)
            .Include(p => p.Seller)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();
        if (product.Status == ProductStatus.Delisted && product.SellerId != userId) return NotFound();

        var isFavorited = userId != null &&
            await _db.Favorites.AnyAsync(f => f.UserId == userId && f.ProductId == id);

        return Ok(ToDto(product, isFavorited));
    }

    // status: "listed" (Active + Reserved, default), "delisted" or "sold".
    [HttpGet("mine")]
    [Authorize]
    public async Task<IActionResult> GetMine([FromQuery] string? status)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var query = _db.Products
            .Include(p => p.Categories)
            .Where(p => p.SellerId == userId);

        query = status?.ToLowerInvariant() switch
        {
            "delisted" => query.Where(p => p.Status == ProductStatus.Delisted),
            "sold" => query.Where(p => p.Status == ProductStatus.Sold),
            _ => query.Where(p => p.Status == ProductStatus.Active || p.Status == ProductStatus.Reserved)
        };

        var products = await query.OrderByDescending(p => p.UpdatedAt).ToListAsync();

        var conversationCounts = (await _db.Conversations
                .Where(c => c.SellerId == userId && c.ProductId != null && c.Messages.Any())
                .GroupBy(c => c.ProductId)
                .Select(g => new { ProductId = g.Key, Count = g.Count() })
                .ToListAsync())
            .ToDictionary(x => x.ProductId!.Value, x => x.Count);

        var unreadCounts = (await _db.Messages
                .Where(m => m.Conversation.SellerId == userId && m.Conversation.ProductId != null &&
                            m.SenderId != userId && !m.IsRead)
                .GroupBy(m => m.Conversation.ProductId)
                .Select(g => new { ProductId = g.Key, Count = g.Count() })
                .ToListAsync())
            .ToDictionary(x => x.ProductId!.Value, x => x.Count);

        var items = products.Select(p => new MyProductItemDto(
            p.Id, p.Title, FormatPrice(p.Price), p.Price == 0,
            p.Condition.ToString(), p.Status.ToString(), p.IconKind, p.BgColorHex,
            SortedCategories(p).Select(c => c.Name).ToList(),
            conversationCounts.GetValueOrDefault(p.Id),
            unreadCounts.GetValueOrDefault(p.Id),
            p.UpdatedAt
        )).ToList();

        return Ok(items);
    }

    [HttpGet("{id:int}/conversations")]
    [Authorize]
    public async Task<IActionResult> GetConversations(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound();
        if (product.SellerId != userId) return Forbid();

        var conversations = await _db.Conversations
            .Where(c => c.ProductId == id && c.SellerId == userId && c.Messages.Any())
            .Include(c => c.Buyer)
            .Include(c => c.Messages)
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync();

        var items = conversations.Select(c =>
        {
            var lastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
            var unreadCount = c.Messages.Count(m => m.SenderId != userId && !m.IsRead);

            return new ConversationListItemDto(
                c.Id, c.ProductId, product.Title,
                c.Buyer.Id, c.Buyer.DisplayName, c.Buyer.AvatarColorHex,
                lastMessage?.Body, c.LastMessageAt, unreadCount
            );
        }).ToList();

        return Ok(items);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { message = "商品名稱為必填。" });
        }

        if (!Enum.TryParse<ProductCondition>(request.Condition, ignoreCase: true, out var condition))
        {
            return BadRequest(new { message = "商品狀況必須是 New 或 Used。" });
        }

        var categories = await LoadCategoriesAsync(request.CategoryIds);
        if (categories == null) return BadRequest(new { message = "請至少選擇一個有效的分類。" });

        var product = new Product
        {
            Title = request.Title.Trim(),
            Description = request.Description,
            Categories = categories,
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

        await _db.Entry(product).Reference(p => p.Seller).LoadAsync();

        return Created($"/api/products/{product.Id}", ToDto(product, false));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateProductRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var product = await _db.Products
            .Include(p => p.Categories)
            .Include(p => p.Seller)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();
        if (product.SellerId != userId) return Forbid();

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { message = "商品名稱為必填。" });
        }

        if (!Enum.TryParse<ProductCondition>(request.Condition, ignoreCase: true, out var condition))
        {
            return BadRequest(new { message = "商品狀況必須是 New 或 Used。" });
        }

        var categories = await LoadCategoriesAsync(request.CategoryIds);
        if (categories == null) return BadRequest(new { message = "請至少選擇一個有效的分類。" });

        product.Title = request.Title.Trim();
        product.Description = request.Description;
        product.Condition = condition;
        product.Price = request.Price < 0 ? 0 : request.Price;
        product.Categories.Clear();
        foreach (var c in categories) product.Categories.Add(c);
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToDto(product, false));
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
            return BadRequest(new { message = "狀態必須是 Active、Reserved、Sold 或 Delisted。" });
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
