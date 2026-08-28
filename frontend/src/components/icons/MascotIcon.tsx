export function BannerMascotIcon({ size = 92 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="90" rx="30" ry="6" fill="rgba(58,46,40,0.08)" />
      <ellipse cx="30" cy="30" rx="14" ry="18" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.5" transform="rotate(-25 30 30)" />
      <ellipse cx="70" cy="30" rx="14" ry="18" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.5" transform="rotate(25 70 30)" />
      <circle cx="50" cy="55" r="34" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.5" />
      <circle cx="39" cy="50" r="3.4" fill="#3A2E28" />
      <circle cx="61" cy="50" r="3.4" fill="#3A2E28" />
      <ellipse cx="50" cy="61" rx="5" ry="3.6" fill="#3A2E28" />
      <path d="M50 65 v6" stroke="#3A2E28" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="24" cy="58" rx="6" ry="4" fill="#F2A0BE" opacity="0.7" />
      <ellipse cx="76" cy="58" rx="6" ry="4" fill="#F2A0BE" opacity="0.7" />
    </svg>
  );
}

export function AvatarMascotIcon({ size = 44, bgColor = "#DCEEE5" }: { size?: number; bgColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="22" fill={bgColor} />
      <path d="M13 14 L17 8 L21 14 Z" fill="#3A2E28" opacity="0.55" />
      <path d="M23 14 L27 8 L31 14 Z" fill="#3A2E28" opacity="0.55" />
      <circle cx="18" cy="24" r="1.8" fill="#3A2E28" />
      <circle cx="26" cy="24" r="1.8" fill="#3A2E28" />
      <ellipse cx="22" cy="29" rx="3" ry="2" fill="#3A2E28" opacity="0.6" />
    </svg>
  );
}
