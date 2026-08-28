using Microsoft.AspNetCore.Identity;

namespace PetMarketplace.Api.Models.Entities;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = "";
    public string AvatarColorHex { get; set; } = "#E9714C";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
