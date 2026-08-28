import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../theme/tokens";
import { HeartIcon, StarIcon } from "./icons/NavIcons";
import { ProductIllustration } from "./icons/ProductIcons";
import { useFavorites } from "../context/FavoritesContext";
import type { ProductListItem } from "../types";

const conditionLabel: Record<string, string> = { New: "全新", Used: "二手" };
const statusLabel: Record<string, string> = { Reserved: "洽談中", Sold: "已售出" };

export function ProductCard({ product, imgHeight = 160 }: { product: ProductListItem; imgHeight?: number }) {
  const navigate = useNavigate();
  const { isFavorited, toggle } = useFavorites();
  const liked = isFavorited(product.id);

  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 12,
        background: colors.cardWhite,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(58,46,40,0.06)",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div
        style={{
          position: "relative",
          background: product.bgColorHex,
          height: imgHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(255,255,255,0.85)",
            padding: "3px 9px",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 700,
            color: colors.textSecondary,
          }}
        >
          {conditionLabel[product.condition] ?? product.condition}
        </div>

        {product.status !== "Active" && (
          <div
            style={{
              position: "absolute",
              top: 34,
              left: 8,
              background: product.status === "Sold" ? colors.textPrimary : colors.accentDefault,
              padding: "3px 9px",
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.offWhite,
            }}
          >
            {statusLabel[product.status] ?? product.status}
          </div>
        )}

        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle(product.id);
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <HeartIcon size={15} filled={liked} color={liked ? colors.heartActive : colors.textPrimary} />
        </div>

        <ProductIllustration kind={product.iconKind} />
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            lineHeight: 1.4,
            height: 34,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.title}
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 16,
            color: product.isFree ? colors.success : colors.accentDefault,
            marginTop: 6,
          }}
        >
          {product.displayPrice}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: product.bgColorHex,
              border: `1.4px solid ${colors.textPrimary}`,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: colors.textSecondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {product.sellerName}
          </div>
          {product.rating != null && (
            <>
              <StarIcon size={10} />
              <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textSecondary }}>{product.rating}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
