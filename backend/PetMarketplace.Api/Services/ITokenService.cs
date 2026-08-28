using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) GenerateToken(ApplicationUser user);
}
