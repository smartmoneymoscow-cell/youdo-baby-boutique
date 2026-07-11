import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { User, LogOut, LayoutDashboard, ClipboardList, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth";

export function UserMenu({ onOpenLogin }: { onOpenLogin: () => void }) {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  if (!user) {
    return (
      <>
        <button
          onClick={onOpenLogin}
          className="hidden md:inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-float transition-shadow whitespace-nowrap"
        >
          <User className="size-4" /> Войти
        </button>
        <button
          onClick={onOpenLogin}
          className="md:hidden size-10 grid place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="Войти"
        >
          <User className="size-5" />
        </button>
      </>
    );
  }

  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-11 pl-1.5 pr-3.5 rounded-full bg-card border border-border hover:border-primary/40 transition-colors whitespace-nowrap"
      >
        <div className="size-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-bold">
          {initials}
        </div>
        <div className="hidden md:block text-left leading-tight">
          <div className="text-[13px] font-semibold text-primary max-w-[110px] truncate">{user.name}</div>
          <div className="text-[10px] text-muted-foreground">{user.role === "admin" ? "Администратор" : "Клиент"}</div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-background border border-border shadow-float p-2 z-50"
          >
            <div className="px-3 py-3 rounded-xl bg-gradient-soft mb-2">
              <div className="text-xs text-muted-foreground">Бонусы</div>
              <div className="text-xl font-extrabold text-primary flex items-center gap-1.5">
                <Gift className="size-4 text-primary-soft" />
                {user.bonuses.toLocaleString("ru-RU")} ₽
              </div>
            </div>
            <MenuLink to="/account" icon={ClipboardList} label="Мои заказы" onClick={() => setOpen(false)} />
            <MenuLink to="/account" icon={Gift} label="Бонусы и профиль" onClick={() => setOpen(false)} />
            {user.role === "admin" && (
              <MenuLink to="/admin" icon={LayoutDashboard} label="Админка" onClick={() => setOpen(false)} />
            )}
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="size-4" /> Выйти
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-secondary transition-colors"
    >
      <Icon className="size-4 text-muted-foreground" /> {label}
    </Link>
  );
}
