import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../../theme/tokens";
import { BackChevronIcon } from "../icons/NavIcons";

export function PageHeader({ title, backTo }: { title: string; backTo?: string }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: colors.cardWhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 10px rgba(58,46,40,0.08)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <BackChevronIcon />
      </div>
      <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 18 }}>{title}</div>
    </div>
  );
}
