import { useState } from "react";
import { colors, fonts } from "../theme/tokens";
import { BannerMascotIcon } from "./icons/MascotIcon";

const SLIDES = [
  { title: "新手交易保障", subtitle: "安心付款・平台全程把關每筆訂單", bg: "#F7C873" },
  { title: "寵物好物任你挑", subtitle: "嚴選喵星人＆汪星人二手好物", bg: "#CDEBDD" },
  { title: "在地寵物社群", subtitle: "鄰近取貨・面交安心又方便", bg: "#F2C6D8" },
];

export function Banner() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  return (
    <>
      <div
        style={{
          position: "relative",
          borderRadius: 22,
          background: slide.bg,
          padding: 20,
          marginBottom: 8,
          overflow: "hidden",
          minHeight: 110,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 200, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 19, color: colors.textPrimary, lineHeight: 1.3 }}>
            {slide.title}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#5C4C42", marginTop: 6, lineHeight: 1.5 }}>
            {slide.subtitle}
          </div>
        </div>
        <div style={{ position: "absolute", right: -6, bottom: -12, zIndex: 0 }}>
          <BannerMascotIcon />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              borderRadius: 999,
              background: i === active ? colors.accentDefault : "#E4D6C8",
              cursor: "pointer",
              transition: "width 0.2s",
            }}
          />
        ))}
      </div>
    </>
  );
}
