import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as favoritesApi from "../api/favorites";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favoritedIds: Set<number>;
  isFavorited: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());

  const refresh = async () => {
    if (!user) {
      setFavoritedIds(new Set());
      return;
    }
    const items = await favoritesApi.fetchFavorites();
    setFavoritedIds(new Set(items.map((i) => i.id)));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggle = async (productId: number) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    try {
      await favoritesApi.toggleFavorite(productId);
    } catch {
      await refresh();
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritedIds,
        isFavorited: (id) => favoritedIds.has(id),
        toggle,
        refresh,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
