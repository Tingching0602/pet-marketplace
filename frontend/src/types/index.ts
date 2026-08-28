export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  avatarColorHex: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserSummary;
}

export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface ProductListItem {
  id: number;
  title: string;
  displayPrice: string;
  isFree: boolean;
  priceRaw: number;
  condition: "New" | "Used";
  status: "Active" | "Reserved" | "Sold";
  iconKind: string;
  bgColorHex: string;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  rating: number | null;
  isFavorited: boolean;
}

export interface ProductDetail extends Omit<ProductListItem, never> {
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  sellerAvatarColorHex: string;
  createdAt: string;
}

export interface ProductListResponse {
  items: ProductListItem[];
  total: number;
}

export interface ConversationListItem {
  id: number;
  productId: number | null;
  productTitle: string | null;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyAvatarColorHex: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageItem {
  id: number;
  senderId: string;
  isOwnMessage: boolean;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProfileStats {
  activeListings: number;
  favorites: number;
  sold: number;
}

export interface Profile {
  displayName: string;
  avatarColorHex: string;
  stats: ProfileStats;
}
