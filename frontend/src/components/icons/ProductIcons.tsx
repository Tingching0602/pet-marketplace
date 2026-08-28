import type { ReactElement } from "react";

interface ProductIconProps {
  size?: number;
}

export function ScratcherIcon({ size = 72 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="70" rx="22" ry="6" fill="rgba(58,46,40,0.12)" />
      <rect x="30" y="26" width="20" height="42" rx="9" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <line x1="32" y1="34" x2="48" y2="42" stroke="#3A2E28" strokeWidth="1.6" opacity="0.5" />
      <line x1="32" y1="44" x2="48" y2="52" stroke="#3A2E28" strokeWidth="1.6" opacity="0.5" />
      <line x1="32" y1="54" x2="48" y2="62" stroke="#3A2E28" strokeWidth="1.6" opacity="0.5" />
      <circle cx="40" cy="16" r="10" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <path d="M32 10 L35 3 L39 9 Z" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
      <path d="M48 10 L45 3 L41 9 Z" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
      <circle cx="37" cy="16" r="1.4" fill="#3A2E28" />
      <circle cx="43" cy="16" r="1.4" fill="#3A2E28" />
    </svg>
  );
}

export function BedIcon({ size = 76 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <rect x="10" y="26" width="60" height="34" rx="17" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <rect x="18" y="33" width="44" height="20" rx="10" fill="none" stroke="#3A2E28" strokeWidth="1.6" opacity="0.5" />
      <circle cx="33" cy="16" r="3.6" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
      <circle cx="47" cy="16" r="3.6" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
      <rect x="36" y="13" width="8" height="6" rx="3" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
    </svg>
  );
}

export function LeashIcon({ size = 72 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="36" cy="34" r="22" fill="none" stroke="#3A2E28" strokeWidth="4.5" />
      <path d="M56 50 C64 56 68 62 70 70" fill="none" stroke="#3A2E28" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 54 l4 10 l4 -10 a4 4 0 1 0 -8 0 Z" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2" />
      <circle cx="32" cy="58" r="1.3" fill="#3A2E28" />
    </svg>
  );
}

export function WandIcon({ size = 72 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <line x1="18" y1="66" x2="52" y2="26" stroke="#3A2E28" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="58" cy="18" r="7" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <path d="M58 18 L70 10 M58 18 L72 18 M58 18 L69 27 M58 18 L52 8 M58 18 L48 16" stroke="#3A2E28" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="58" cy="18" r="2" fill="#3A2E28" />
    </svg>
  );
}

export function CarrierIcon({ size = 72 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <path d="M16 60 V38 a24 24 0 0 1 48 0 V60 Z" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <path d="M28 30 a12 12 0 0 1 24 0" fill="none" stroke="#3A2E28" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="46" r="9" fill="none" stroke="#3A2E28" strokeWidth="1.8" />
      <circle cx="40" cy="43" r="2.4" fill="#3A2E28" />
      <circle cx="36" cy="49" r="1.6" fill="#3A2E28" />
      <circle cx="44" cy="49" r="1.6" fill="#3A2E28" />
    </svg>
  );
}

export function BowlIcon({ size = 76 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="26" cy="48" rx="20" ry="12" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <ellipse cx="26" cy="45" rx="13" ry="6.5" fill="none" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <circle cx="22" cy="45" r="1.6" fill="#3A2E28" opacity="0.6" />
      <circle cx="28" cy="47" r="1.6" fill="#3A2E28" opacity="0.6" />
      <ellipse cx="56" cy="40" rx="16" ry="10" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <ellipse cx="56" cy="37.5" rx="10.5" ry="5.2" fill="none" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

export function CageIcon({ size = 76 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <rect x="12" y="24" width="56" height="38" rx="10" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <line x1="22" y1="24" x2="22" y2="62" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <line x1="32" y1="24" x2="32" y2="62" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <line x1="42" y1="24" x2="42" y2="62" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <line x1="52" y1="24" x2="52" y2="62" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <line x1="62" y1="24" x2="62" y2="62" stroke="#3A2E28" strokeWidth="1.4" opacity="0.5" />
      <circle cx="40" cy="43" r="8" fill="none" stroke="#3A2E28" strokeWidth="1.6" />
      <path d="M32 16 a8 8 0 0 1 16 0" fill="none" stroke="#3A2E28" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function BoneIcon({ size = 72 }: ProductIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <rect x="20" y="36" width="40" height="10" rx="5" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <circle cx="18" cy="32" r="8" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <circle cx="18" cy="48" r="8" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <circle cx="62" cy="32" r="8" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
      <circle cx="62" cy="48" r="8" fill="#FFFDFB" stroke="#3A2E28" strokeWidth="2.2" />
    </svg>
  );
}

const ICONS: Record<string, (props: ProductIconProps) => ReactElement> = {
  scratcher: ScratcherIcon,
  bed: BedIcon,
  leash: LeashIcon,
  wand: WandIcon,
  carrier: CarrierIcon,
  bowl: BowlIcon,
  cage: CageIcon,
  bone: BoneIcon,
};

export function ProductIllustration({ kind, size }: { kind: string; size?: number }) {
  const Icon = ICONS[kind] ?? BowlIcon;
  return <Icon size={size} />;
}
