import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { ProductIllustration } from "../components/icons/ProductIcons";
import { CartIcon, HeartIcon, MessagesIcon, ShareIcon, StarIcon } from "../components/icons/NavIcons";
import { colors, fonts } from "../theme/tokens";
import { fetchProduct, updateProductStatus } from "../api/products";
import { sendMessage, startConversation } from "../api/conversations";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import type { ProductDetail } from "../types";

const conditionLabel: Record<string, string> = { New: "全新", Used: "二手" };
const statusBadge: Record<string, { label: string; bg: string }> = {
  Reserved: { label: "洽談中", bg: colors.accentDefault },
  Sold: { label: "已售出", bg: colors.textPrimary },
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);
  const [buying, setBuying] = useState(false);
  const [marking, setMarking] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const productId = Number(id);

  const load = () => {
    setLoading(true);
    fetchProduct(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [productId]);

  const requireAuth = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <AppShell>
        <PageHeader title="商品詳情" backTo="/" />
        <div style={{ color: colors.textMuted, fontWeight: 700, padding: 40, textAlign: "center" }}>載入中...</div>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell>
        <PageHeader title="商品詳情" backTo="/" />
        <div style={{ color: colors.textMuted, fontWeight: 700, padding: 40, textAlign: "center" }}>找不到這個商品。</div>
      </AppShell>
    );
  }

  const isOwner = user?.id === product.sellerId;
  const liked = isFavorited(product.id);
  const badge = statusBadge[product.status];

  const handleToggleFavorite = () => {
    if (!requireAuth()) return;
    toggle(product.id);
  };

  const handleMessageSeller = async () => {
    if (!requireAuth()) return;
    setMessaging(true);
    try {
      const res = await startConversation({ productId: product.id });
      navigate(`/messages/${res.id}`);
    } finally {
      setMessaging(false);
    }
  };

  const handleBuyNow = async () => {
    if (!requireAuth()) return;
    setBuying(true);
    try {
      const res = await startConversation({ productId: product.id });
      await sendMessage(res.id, `我要購買這件商品:${product.title}`);
      await updateProductStatus(product.id, "Reserved");
      navigate(`/messages/${res.id}`);
    } finally {
      setBuying(false);
    }
  };

  const handleUpdateStatus = async (status: "Active" | "Sold") => {
    setMarking(true);
    try {
      await updateProductStatus(product.id, status);
      load();
    } finally {
      setMarking(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.id}`;
    const shareData = { title: product.title, text: `來看看毛孩市集上的「${product.title}」`, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fall through to clipboard copy (e.g. user cancelled or API unsupported for this input)
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 1800);
    } catch {
      window.prompt("複製這個連結分享給朋友:", url);
    }
  };

  return (
    <AppShell>
      <PageHeader title="商品詳情" backTo="/" />

      <div style={{ background: colors.cardWhite, borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 10px rgba(58,46,40,0.06)" }}>
        <div style={{ position: "relative", background: product.bgColorHex, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.85)", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: colors.textSecondary }}>
            {conditionLabel[product.condition] ?? product.condition}
          </div>
          {badge && (
            <div style={{ position: "absolute", top: 12, right: 12, background: badge.bg, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: colors.offWhite }}>
              {badge.label}
            </div>
          )}
          <ProductIllustration kind={product.iconKind} size={140} />
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, flex: 1 }}>{product.title}</div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <div
                onClick={handleShare}
                style={{ width: 36, height: 36, borderRadius: 999, background: colors.background, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ShareIcon size={16} />
              </div>
              {!isOwner && (
                <div
                  onClick={handleToggleFavorite}
                  style={{ width: 36, height: 36, borderRadius: 999, background: colors.background, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <HeartIcon size={18} filled={liked} color={liked ? colors.heartActive : colors.textPrimary} />
                </div>
              )}
            </div>
          </div>

          {shareFeedback && (
            <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.success, marginTop: 6, textAlign: "right" }}>連結已複製!</div>
          )}

          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 22, color: product.isFree ? colors.success : colors.accentDefault, marginTop: 10 }}>
            {product.displayPrice}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${colors.divider}` }}>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>商品說明</div>
            {product.description ? (
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {product.description}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.textMuted }}>賣家還沒有填寫商品說明。</div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${colors.divider}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: product.bgColorHex, border: `1.4px solid ${colors.textPrimary}` }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{product.sellerName}</div>
              {product.rating != null && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <StarIcon size={11} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary }}>{product.rating}</div>
                </div>
              )}
            </div>
          </div>

          {!isOwner && product.status !== "Sold" && (
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {product.status === "Active" && (
                <div
                  onClick={buying ? undefined : handleBuyNow}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: colors.accentDefault,
                    borderRadius: 999,
                    padding: 14,
                    cursor: "pointer",
                    boxShadow: "0 6px 14px rgba(233,113,76,0.35)",
                    opacity: buying ? 0.7 : 1,
                  }}
                >
                  <CartIcon size={17} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: colors.offWhite }}>{buying ? "處理中..." : "我要購買"}</div>
                </div>
              )}
              <div
                onClick={messaging ? undefined : handleMessageSeller}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: colors.cardWhite,
                  border: `1.5px solid ${colors.accentDefault}`,
                  borderRadius: 999,
                  padding: 14,
                  cursor: "pointer",
                  opacity: messaging ? 0.7 : 1,
                }}
              >
                <MessagesIcon size={17} color={colors.accentDefault} />
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.accentDefault }}>{messaging ? "開啟中..." : "訊息賣家"}</div>
              </div>
            </div>
          )}

          {!isOwner && product.status === "Reserved" && (
            <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>
              這件商品目前正在與其他買家洽談,仍可詢問賣家是否還有機會。
            </div>
          )}

          {isOwner && product.status === "Active" && (
            <div
              onClick={marking ? undefined : () => handleUpdateStatus("Sold")}
              style={{
                marginTop: 18,
                textAlign: "center",
                background: colors.background,
                border: `1.5px solid ${colors.border}`,
                borderRadius: 999,
                padding: 14,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                color: colors.textPrimary,
                opacity: marking ? 0.7 : 1,
              }}
            >
              {marking ? "更新中..." : "標示為已售出"}
            </div>
          )}

          {isOwner && product.status === "Reserved" && (
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <div
                onClick={marking ? undefined : () => handleUpdateStatus("Sold")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: colors.accentDefault,
                  borderRadius: 999,
                  padding: 14,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  color: colors.offWhite,
                  opacity: marking ? 0.7 : 1,
                }}
              >
                確認售出
              </div>
              <div
                onClick={marking ? undefined : () => handleUpdateStatus("Active")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: colors.background,
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: 999,
                  padding: 14,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  color: colors.textPrimary,
                  opacity: marking ? 0.7 : 1,
                }}
              >
                恢復上架
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
