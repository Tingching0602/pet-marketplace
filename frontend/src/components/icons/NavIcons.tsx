import type { IconProps } from "./types";

export function SearchIcon({ size = 20, color = "#B3A79A", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="6" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </svg>
  );
}

export function ClearIcon({ size = 16, color = "#B3A79A", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" className={className}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function BackChevronIcon({ size = 18, color = "#3A2E28", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 14, color = "#D8CBBE", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function HeartIcon({ size = 21, color = "#3A2E28", filled = false, className }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : "none"} className={className}>
      <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.03 Z" />
    </svg>
  );
}

export function MessagesIcon({ size = 21, color = "#3A2E28", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1Z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="13.5" x2="13" y2="13.5" />
    </svg>
  );
}

export function PlusIcon({ size = 22, color = "#FFFDFB", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.6} strokeLinecap="round" className={className}>
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

export function RefreshIcon({ size = 21, color = "#3A2E28", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

export function ProfileIcon({ size = 21, color = "#3A2E28", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-6.5 8-6.5s8 2.1 8 6.5" />
    </svg>
  );
}

export function CameraIcon({ size = 26, color = "#B3A79A", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className={className}>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M8 7 L9.5 4 h5 L16 7" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.6" />
    </svg>
  );
}

export function CheckIcon({ size = 16, color = "#6FBFA0", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ShareIcon({ size = 18, color = "#3A2E28", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </svg>
  );
}

export function CartIcon({ size = 18, color = "#FFFDFB", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="20" r="1.4" fill={color} stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill={color} stroke="none" />
      <path d="M2.5 3h2l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

export function StarIcon({ size = 10, color = "#F7C873", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} className={className}>
      <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01L12 2Z" />
    </svg>
  );
}
