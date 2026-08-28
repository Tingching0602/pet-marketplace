import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { ProductCard } from "../components/ProductCard";
import { HeartIcon } from "../components/icons/NavIcons";
import { colors, fonts } from "../theme/tokens";
import { fetchFavorites } from "../api/favorites";
import { useFavorites } from "../context/FavoritesContext";
import type { ProductListItem } from "../types";

const CARD_HEIGHTS = [150, 190, 130, 200, 160, 170];

export function FavoritesPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritedIds } = useFavorites();

  const load = () => {
    setLoading(true);
    fetchFavorites()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [favoritedIds.size]);

  return (
    <AppShell>
      <PageHeader title="我的收藏" backTo="/" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17 }}>我的收藏</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>{products.length} 件收藏</div>
      </div>

      {!loading && products.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "50px 20px" }}>
          <HeartIcon size={56} color="#E4D6C8" />
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, textAlign: "center", lineHeight: 1.6 }}>
            還沒有收藏的商品
            <br />
            點商品卡片上的愛心收藏喜歡的寶貝吧!
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div style={{ columnCount: 2, columnGap: 12 }}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} imgHeight={CARD_HEIGHTS[i % CARD_HEIGHTS.length]} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
