namespace PetMarketplace.Api.Models.Entities;

public class Conversation
{
    public int Id { get; set; }

    public int? ProductId { get; set; }
    public Product? Product { get; set; }

    public string BuyerId { get; set; } = "";
    public ApplicationUser Buyer { get; set; } = null!;

    public string SellerId { get; set; } = "";
    public ApplicationUser Seller { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
