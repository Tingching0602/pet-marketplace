import { apiGet, apiPost } from "./client";
import type { ProductListItem } from "../types";

export const fetchFavorites = () => apiGet<ProductListItem[]>("/favorites");

export const toggleFavorite = (productId: number) =>
  apiPost<{ isFavorited: boolean }>(`/favorites/${productId}/toggle`);
