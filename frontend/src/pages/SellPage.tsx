import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { CameraIcon, CheckIcon } from "../components/icons/NavIcons";
import { colors, fonts } from "../theme/tokens";
import { fetchCategories, createProduct } from "../api/products";
import type { Category } from "../types";

const inputStyle: React.CSSProperties = {
  background: colors.cardWhite,
  border: `1.5px solid ${colors.border}`,
  borderRadius: 12,
  padding: "12px 14px",
  fontFamily: fonts.body,
  fontSize: 13.5,
  fontWeight: 600,
  color: colors.textPrimary,
  width: "100%",
};

const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#5C4C42" };

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        background: active ? colors.accentDefault : colors.cardWhite,
        color: active ? colors.offWhite : "#5C4C42",
        border: `1.5px solid ${active ? colors.accentDefault : colors.border}`,
      }}
    >
      {label}
    </div>
  );
}

export function SellPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [condition, setCondition] = useState<"New" | "Used" | null>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim() || !categoryId || !condition) {
      setError("請填寫商品名稱、分類與商品狀況。");
      return;
    }
    setSubmitting(true);
    try {
      await createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
        condition,
        price: Number(price) || 0,
      });
      setSubmitted(true);
      setTimeout(() => navigate("/"), 1200);
    } catch {
      setError("上架失敗,請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title="新增商品" backTo="/" />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            border: `2px dashed ${colors.border}`,
            borderRadius: 16,
            height: 110,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: colors.cardWhite,
          }}
        >
          <CameraIcon />
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>新增商品照片</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={labelStyle}>商品名稱</div>
          <input style={inputStyle} type="text" placeholder="例如:貓抓板柱 二手9成新" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={labelStyle}>商品分類</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <Chip key={c.id} label={c.name} active={categoryId === c.id} onClick={() => setCategoryId(c.id)} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={labelStyle}>商品狀況</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Chip label="全新" active={condition === "New"} onClick={() => setCondition("New")} />
            <Chip label="二手" active={condition === "Used"} onClick={() => setCondition("Used")} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={labelStyle}>售價(免費請填 0)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: colors.cardWhite, border: `1.5px solid ${colors.border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: colors.textMuted }}>NT$</div>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ border: "none", background: "transparent", fontFamily: fonts.body, fontSize: 13.5, fontWeight: 600, color: colors.textPrimary, flex: 1, minWidth: 0 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={labelStyle}>商品說明</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: colors.textMuted, marginTop: -2 }}>
            寫得越詳細,買家越安心。可以包含:購入時間、使用/保存狀況、尺寸材質、交易方式(面交/寄送)等。
          </div>
          <textarea
            placeholder={"例如:\n2024年購入,約使用半年,功能正常無破損。\n附原廠說明書,可面交(台北市)或寄送(另收運費)。"}
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {error && <div style={{ fontSize: 12.5, fontWeight: 700, color: "#C85A38" }}>{error}</div>}

        <div
          onClick={submitting ? undefined : handleSubmit}
          style={{
            background: colors.accentDefault,
            borderRadius: 999,
            padding: 14,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 14,
            color: colors.offWhite,
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(233,113,76,0.35)",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "上架中..." : "確認上架"}
        </div>

        {submitted && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: 6 }}>
            <CheckIcon />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.success }}>商品已成功上架!</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
