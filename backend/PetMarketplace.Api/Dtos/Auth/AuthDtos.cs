namespace PetMarketplace.Api.Dtos.Auth;

public record RegisterRequest(string Email, string Password, string DisplayName);

public record LoginRequest(string Email, string Password);

public record UserSummaryDto(string Id, string Email, string DisplayName, string AvatarColorHex);

public record AuthResponse(string Token, DateTime ExpiresAt, UserSummaryDto User);
