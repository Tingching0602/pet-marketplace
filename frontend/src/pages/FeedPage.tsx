import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { CategoryChips } from "../components/CategoryChips";
import { Banner } from "../components/Banner";
import { ProductCard } from "../components/ProductCard";
import { SearchIcon, ClearIcon, HeartIcon } from "../components/icons/NavIcons";
import { colors, fonts } from "../theme/tokens";
import { fetchCategories, fetchProducts } from "../api/products";
import type { Category, ProductListItem } from "../types";

const FEED_TABS = [
  { id: "hot" as const, label: "熱門商品" },
  { id: "new" as const, label: "最新上架" },
  { id: "free" as const, label: "免費專區" },
];

const CARD_HEIGHTS = [150, 190, 130, 200, 160, 170];

export function FeedPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [feedTab, setFeedTab] = useState<"hot" | "new" | "free">("hot");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const load = () => {
    setLoading(true);
    const query = isSearching
      ? { search: searchQuery.trim() }
      : { category: activeCategory, tab: feedTab };
    fetchProducts(query)
      .then((res) => setProducts(res.items))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, feedTab, searchQuery]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener("feed-refresh", handler);
    return () => window.removeEventListener("feed-refresh", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, feedTab, searchQuery]);

  const runSearch = () => setSearchQuery(searchDraft);
  const clearSearch = () => {
    setSearchDraft("");
    setSearchQuery("");
  };

  return (
    <AppShell>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            background: colors.cardWhite,
            borderRadius: 999,
            padding: "10px 16px",
            gap: 10,
            boxShadow: "0 4px 14px rgba(58,46,40,0.08)",
          }}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="搜尋寵物用品、玩具、飼育箱..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            style={{
              border: "none",
              background: "transparent",
              fontFamily: fonts.body,
              fontSize: 14,
              fontWeight: 600,
              color: colors.textPrimary,
              flex: 1,
              minWidth: 0,
            }}
          />
          {isSearching && (
            <div onClick={clearSearch} style={{ cursor: "pointer", display: "flex" }}>
              <ClearIcon />
            </div>
          )}
        </div>
        <div
          onClick={runSearch}
          style={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: 999,
            background: colors.accentDefault,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(233,113,76,0.35)",
          }}
        >
          <SearchIcon size={18} color={colors.offWhite} />
        </div>
      </div>

      {!isSearching && (
        <div className="chip-row" style={{ marginTop: 12 }}>
          <CategoryChips categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {!isSearching && <Banner />}

        {!isSearching && (
          <>
            <div style={{ display: "flex", gap: 20 }}>
              {FEED_TABS.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setFeedTab(tab.id)}
                  style={{
                    cursor: "pointer",
                    paddingBottom: 8,
                    borderBottom: `2.5px solid ${feedTab === tab.id ? colors.accentDefault : "transparent"}`,
                    fontWeight: 700,
                    fontSize: 14,
                    color: feedTab === tab.id ? colors.accentDefault : "#8A7B70",
                  }}
                >
                  {tab.label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "6px 0 12px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>{products.length} 件商品</div>
            </div>
          </>
        )}

        {isSearching && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17 }}>搜尋結果</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>找到 {products.length} 件商品</div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "50px 20px" }}>
            <HeartIcon size={56} color="#E4D6C8" />
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, textAlign: "center", lineHeight: 1.6 }}>
              {isSearching ? `找不到與「${searchQuery.trim()}」相關的商品` : "此分類目前沒有商品"}
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
      </div>
    </AppShell>
  );
}
