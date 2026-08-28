namespace PetMarketplace.Api.Models.Entities;

public class Favorite
{
    public string UserId { get; set; } = "";
    public ApplicationUser User { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
