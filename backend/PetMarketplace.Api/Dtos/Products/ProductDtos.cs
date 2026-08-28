namespace PetMarketplace.Api.Dtos.Products;

public record CategoryDto(int Id, string Name, int DisplayOrder);

public record ProductListItemDto(
    int Id,
    string Title,
    string DisplayPrice,
    bool IsFree,
    decimal PriceRaw,
    string Condition,
    string Status,
    string IconKind,
    string BgColorHex,
    string CategoryName,
    string SellerId,
    string SellerName,
    decimal? Rating,
    bool IsFavorited
);

public record ProductDto(
    int Id,
    string Title,
    string? Description,
    string DisplayPrice,
    bool IsFree,
    decimal PriceRaw,
    string Condition,
    string Status,
    string? ImageUrl,
    string IconKind,
    string BgColorHex,
    int CategoryId,
    string CategoryName,
    string SellerId,
    string SellerName,
    string SellerAvatarColorHex,
    decimal? Rating,
    bool IsFavorited,
    DateTime CreatedAt
);

public record ProductListResponse(List<ProductListItemDto> Items, int Total);

public record CreateProductRequest(
    string Title,
    string? Description,
    int CategoryId,
    string Condition,
    decimal Price,
    string? IconKind,
    string? ImageUrl
);

public record UpdateProductStatusRequest(string Status);
