namespace PetMarketplace.Api.Models.Entities;

public class Message
{
    public int Id { get; set; }

    public int ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;

    public string SenderId { get; set; } = "";
    public ApplicationUser Sender { get; set; } = null!;

    public string Body { get; set; } = "";
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
