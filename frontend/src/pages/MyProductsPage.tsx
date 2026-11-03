import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { ProductIllustration } from "../components/icons/ProductIcons";
import { AvatarMascotIcon } from "../components/icons/MascotIcon";
import { colors, fonts } from "../theme/tokens";
import {
  fetchMyProducts,
  fetchProductConversations,
  updateProductStatus,
  type MyProductsFilter,
} from "../api/products";
import { formatRelativeTime } from "./MessagesPage";
import type { ConversationListItem, MyProductItem } from "../types";

const TABS: { key: MyProductsFilter; label: string }[] = [
  { key: "listed", label: "上架中" },
  { key: "delisted", label: "已下架" },
  { key: "sold", label: "已售出" },
];

const conditionLabel: Record<string, string> = { New: "全新", Used: "二手" };

const actionStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  padding: "8px 0",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  border: `1.5px solid ${colors.border}`,
  background: colors.cardWhite,
  color: colors.textPrimary,
};

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      style={{
        minWidth: 16,
        height: 16,
        borderRadius: 999,
        background: colors.accentDefault,
        color: colors.offWhite,
        fontSize: 10,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 4px",
        marginLeft: 4,
      }}
    >
      {count}
    </span>
  );
}

function ProductConversations({ productId }: { productId: number }) {
  const navigate = useNavigate();
  const [items, setItems] = useState<ConversationListItem[] | null>(null);

  useEffect(() => {
    fetchProductConversations(productId)
      .then(setItems)
      .catch(() => setItems([]));
  }, [productId]);

  if (items == null) {
    return <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, padding: "10px 0" }}>載入中...</div>;
  }

  if (items.length === 0) {
    return <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, padding: "10px 0" }}>還沒有買家詢問這件商品。</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((c) => (
        <div
          key={c.id}
          onClick={() => navigate(`/messages/${c.id}`)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${colors.divider}`, cursor: "pointer" }}
        >
          <AvatarMascotIcon size={34} bgColor={c.otherPartyAvatarColorHex} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.otherPartyName}</div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: colors.textSecondary,
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.lastMessage ?? "尚無訊息"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: colors.textMuted }}>{formatRelativeTime(c.lastMessageAt)}</div>
            <UnreadBadge count={c.unreadCount} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MyProductRow({ product, onChanged }: { product: MyProductItem; onChanged: () => void }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const setStatus = async (status: "Active" | "Delisted") => {
    if (status === "Delisted" && !window.confirm(`確定要下架「${product.title}」嗎?下架後買家將看不到這件商品。`)) return;
    setUpdating(true);
    try {
      await updateProductStatus(product.id, status);
      onChanged();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ background: colors.cardWhite, borderRadius: 18, padding: 14, boxShadow: "0 3px 10px rgba(58,46,40,0.06)" }}>
      <div style={{ display: "flex", gap: 12, cursor: "pointer" }} onClick={() => navigate(`/products/${product.id}`)}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 14,
            background: product.bgColorHex,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ProductIllustration kind={product.iconKind} size={52} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.title}
            </div>
            {product.status === "Reserved" && (
              <div style={{ background: colors.accentDefault, color: colors.offWhite, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
                洽談中
              </div>
            )}
          </div>
          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 15, color: product.isFree ? colors.success : colors.accentDefault, marginTop: 4 }}>
            {product.displayPrice}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: colors.textSecondary, background: colors.background, padding: "2px 8px", borderRadius: 999 }}>
              {conditionLabel[product.condition] ?? product.condition}
            </span>
            {product.categoryNames.map((name) => (
              <span key={name} style={{ fontSize: 10.5, fontWeight: 700, color: colors.textSecondary, background: colors.background, padding: "2px 8px", borderRadius: 999 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, opacity: updating ? 0.6 : 1 }}>
        <div style={actionStyle} onClick={() => navigate(`/products/${product.id}/edit`)}>
          編輯
        </div>
        {(product.status === "Active" || product.status === "Reserved") && (
          <div style={actionStyle} onClick={updating ? undefined : () => setStatus("Delisted")}>
            下架
          </div>
        )}
        {product.status === "Delisted" && (
          <div style={{ ...actionStyle, borderColor: colors.accentDefault, color: colors.accentDefault }} onClick={updating ? undefined : () => setStatus("Active")}>
            重新上架
          </div>
        )}
        <div
          style={{ ...actionStyle, ...(expanded ? { background: colors.background } : {}) }}
          onClick={() => setExpanded((v) => !v)}
        >
          買家對話 {product.conversationCount}
          <UnreadBadge count={product.unreadCount} />
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 8 }}>
          <ProductConversations productId={product.id} />
        </div>
      )}
    </div>
  );
}

export function MyProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (TABS.find((t) => t.key === searchParams.get("tab"))?.key ?? "listed") as MyProductsFilter;
  const [products, setProducts] = useState<MyProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyProducts(tab)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  return (
    <AppShell>
      <PageHeader title="我的商品" backTo="/profile" />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {TABS.map((t) => (
          <div
            key={t.key}
            onClick={() => setSearchParams({ tab: t.key })}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: tab === t.key ? colors.accentDefault : colors.cardWhite,
              color: tab === t.key ? colors.offWhite : "#5C4C42",
              border: `1.5px solid ${tab === t.key ? colors.accentDefault : colors.border}`,
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div style={{ color: colors.textMuted, fontWeight: 600, fontSize: 13, textAlign: "center", padding: "50px 20px" }}>
          這裡還沒有商品。
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.map((p) => (
          <MyProductRow key={p.id} product={p} onChanged={load} />
        ))}
      </div>
    </AppShell>
  );
}
