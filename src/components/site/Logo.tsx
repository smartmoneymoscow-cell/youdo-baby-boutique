export function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Заказ с YouDo"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="ydBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.35 0.12 262)" />
            <stop offset="100%" stopColor="oklch(0.48 0.16 258)" />
          </linearGradient>
          <linearGradient id="ydCream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbf3df" />
            <stop offset="100%" stopColor="#efd9a8" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#ydBg)" />
        {/* Ears */}
        <circle cx="20" cy="22" r="7" fill="url(#ydCream)" />
        <circle cx="44" cy="22" r="7" fill="url(#ydCream)" />
        <circle cx="20" cy="22" r="3" fill="oklch(0.35 0.12 262)" opacity="0.35" />
        <circle cx="44" cy="22" r="3" fill="oklch(0.35 0.12 262)" opacity="0.35" />
        {/* Head */}
        <ellipse cx="32" cy="36" rx="16" ry="15" fill="url(#ydCream)" />
        {/* Muzzle */}
        <ellipse cx="32" cy="42" rx="8" ry="6" fill="#fff8e6" />
        {/* Eyes */}
        <circle cx="26" cy="35" r="1.7" fill="oklch(0.22 0.06 262)" />
        <circle cx="38" cy="35" r="1.7" fill="oklch(0.22 0.06 262)" />
        <circle cx="26.5" cy="34.5" r="0.5" fill="#fff" />
        <circle cx="38.5" cy="34.5" r="0.5" fill="#fff" />
        {/* Nose */}
        <ellipse cx="32" cy="40.5" rx="1.8" ry="1.4" fill="oklch(0.22 0.06 262)" />
        <path d="M32 42 Q30 45 28 44 M32 42 Q34 45 36 44" stroke="oklch(0.22 0.06 262)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        {/* Bow */}
        <path d="M46 48 L52 44 L52 52 Z" fill="#e5b6c4" />
        <path d="M46 48 L52 46 L52 50 Z" fill="#d29aab" />
      </svg>
      {showText && (
        <div className="leading-tight">
          <div className="text-[15px] md:text-[17px] font-extrabold text-primary tracking-tight">
            Заказ с <span className="font-serif italic font-medium text-primary-soft">YouDo</span>
          </div>
          <div className="hidden md:block text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Premium baby boutique
          </div>
        </div>
      )}
    </div>
  );
}
