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
    List<string> CategoryNames,
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
    List<int> CategoryIds,
    List<string> CategoryNames,
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
    List<int> CategoryIds,
    string Condition,
    decimal Price,
    string? IconKind,
    string? ImageUrl
);

public record UpdateProductRequest(
    string Title,
    string? Description,
    List<int> CategoryIds,
    string Condition,
    decimal Price
);

public record UpdateProductStatusRequest(string Status);

public record MyProductItemDto(
    int Id,
    string Title,
    string DisplayPrice,
    bool IsFree,
    string Condition,
    string Status,
    string IconKind,
    string BgColorHex,
    List<string> CategoryNames,
    int ConversationCount,
    int UnreadCount,
    DateTime UpdatedAt
);
