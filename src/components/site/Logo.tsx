import bearLogo from "@/assets/bear-logo.png.asset.json";

export function Logo({ size = 44, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={bearLogo.url}
        alt="Заказ с YouDo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-[22%] object-cover shadow-sm ring-1 ring-primary/10"
      />
      {showText && (
        <div className="leading-tight min-w-0 overflow-hidden">
          <div className="text-[15px] md:text-[17px] font-extrabold text-primary tracking-tight truncate">
            Заказ с <span className="font-serif italic font-medium">YouDo</span>
          </div>
          <div className="hidden md:block text-[9px] uppercase tracking-[0.22em] text-muted-foreground truncate">
            Premium baby boutique
          </div>
        </div>
      )}
    </div>
  );
}
