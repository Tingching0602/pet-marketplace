using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos.Conversations;
using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ConversationsController(AppDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = CurrentUserId;

        var conversations = await _db.Conversations
            .Where(c => c.BuyerId == userId || c.SellerId == userId)
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .Include(c => c.Product)
            .Include(c => c.Messages)
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync();

        var items = conversations.Select(c =>
        {
            var otherParty = c.BuyerId == userId ? c.Seller : c.Buyer;
            var lastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
            var unreadCount = c.Messages.Count(m => m.SenderId != userId && !m.IsRead);

            return new ConversationListItemDto(
                c.Id, c.ProductId, c.Product?.Title,
                otherParty.Id, otherParty.DisplayName, otherParty.AvatarColorHex,
                lastMessage?.Body, c.LastMessageAt, unreadCount
            );
        }).ToList();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> StartOrGet(StartConversationRequest request)
    {
        var buyerId = CurrentUserId;

        string sellerId;
        int? productId = null;

        if (request.ProductId.HasValue)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId.Value);
            if (product == null) return NotFound(new { message = "商品不存在。" });
            sellerId = product.SellerId;
            productId = product.Id;
        }
        else if (!string.IsNullOrWhiteSpace(request.SellerId))
        {
            sellerId = request.SellerId;
        }
        else
        {
            return BadRequest(new { message = "需要提供 productId 或 sellerId。" });
        }

        if (sellerId == buyerId)
        {
            return BadRequest(new { message = "不能與自己開始對話。" });
        }

        var existing = await _db.Conversations.FirstOrDefaultAsync(c =>
            c.BuyerId == buyerId && c.SellerId == sellerId &&
            (productId == null ? c.ProductId == null : c.ProductId == productId));

        if (existing != null)
        {
            return Ok(new { id = existing.Id });
        }

        var conversation = new Conversation
        {
            BuyerId = buyerId,
            SellerId = sellerId,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow,
            LastMessageAt = DateTime.UtcNow
        };
        _db.Conversations.Add(conversation);
        await _db.SaveChangesAsync();

        return Created($"/api/conversations/{conversation.Id}", new { id = conversation.Id });
    }

    [HttpGet("{id:int}/messages")]
    public async Task<IActionResult> GetMessages(int id)
    {
        var userId = CurrentUserId;
        var conversation = await _db.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conversation == null) return NotFound();
        if (conversation.BuyerId != userId && conversation.SellerId != userId) return Forbid();

        var unread = conversation.Messages.Where(m => m.SenderId != userId && !m.IsRead).ToList();
        if (unread.Count > 0)
        {
            foreach (var m in unread) m.IsRead = true;
            await _db.SaveChangesAsync();
        }

        var messages = conversation.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto(m.Id, m.SenderId, m.SenderId == userId, m.Body, m.IsRead, m.CreatedAt))
            .ToList();

        return Ok(messages);
    }

    [HttpPost("{id:int}/messages")]
    public async Task<IActionResult> SendMessage(int id, SendMessageRequest request)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrWhiteSpace(request.Body)) return BadRequest(new { message = "訊息內容不可為空。" });

        var conversation = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == id);
        if (conversation == null) return NotFound();
        if (conversation.BuyerId != userId && conversation.SellerId != userId) return Forbid();

        var message = new Message
        {
            ConversationId = id,
            SenderId = userId,
            Body = request.Body.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
        _db.Messages.Add(message);
        conversation.LastMessageAt = message.CreatedAt;
        await _db.SaveChangesAsync();

        return Created(string.Empty, new MessageDto(message.Id, message.SenderId, true, message.Body, message.IsRead, message.CreatedAt));
    }
}
