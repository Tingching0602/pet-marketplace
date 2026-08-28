namespace PetMarketplace.Api.Dtos;

public record ProfileStatsDto(int ActiveListings, int Favorites, int Sold);

public record ProfileDto(string DisplayName, string AvatarColorHex, ProfileStatsDto Stats);
