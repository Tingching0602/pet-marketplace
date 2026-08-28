namespace PetMarketplace.Api.Models.Entities;

public enum ProductCondition
{
    New,
    Used
}

public enum ProductStatus
{
    Active,
    Reserved,
    Sold
}

public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public ProductCondition Condition { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string? ImageUrl { get; set; }
    public decimal? Rating { get; set; }
    public string BgColorHex { get; set; } = "#DCEEE5";
    public string IconKind { get; set; } = "bowl";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string SellerId { get; set; } = "";
    public ApplicationUser Seller { get; set; } = null!;

    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
