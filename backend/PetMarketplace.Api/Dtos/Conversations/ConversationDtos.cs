namespace PetMarketplace.Api.Dtos.Conversations;

public record ConversationListItemDto(
    int Id,
    int? ProductId,
    string? ProductTitle,
    string OtherPartyId,
    string OtherPartyName,
    string OtherPartyAvatarColorHex,
    string? LastMessage,
    DateTime LastMessageAt,
    int UnreadCount
);

public record MessageDto(int Id, string SenderId, bool IsOwnMessage, string Body, bool IsRead, DateTime CreatedAt);

public record StartConversationRequest(int? ProductId, string? SellerId);

public record SendMessageRequest(string Body);
