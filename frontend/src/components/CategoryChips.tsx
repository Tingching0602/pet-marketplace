import { colors } from "../theme/tokens";
import type { Category } from "../types";

export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string;
  onSelect: (name: string) => void;
}) {
  const all = [{ id: 0, name: "全部", displayOrder: -1 }, ...categories];

  return (
    <div className="chip-row" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
      {all.map((c) => {
        const isActive = c.name === active;
        return (
          <div
            key={c.id}
            onClick={() => onSelect(c.name)}
            style={{
              flexShrink: 0,
              padding: "7px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: isActive ? colors.accentDefault : colors.cardWhite,
              color: isActive ? colors.offWhite : "#5C4C42",
              border: `1.5px solid ${isActive ? colors.accentDefault : colors.border}`,
            }}
          >
            {c.name}
          </div>
        );
      })}
    </div>
  );
}
