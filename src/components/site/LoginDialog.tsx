import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const login = useAuth((s) => s.login);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = login(username, password);
    if (r.ok) {
      toast.success(`Добро пожаловать, ${username}!`);
      onOpenChange(false);
      setUsername("");
      setPassword("");
    } else {
      setErr(r.error ?? "Неверные данные");
    }
  };

  const fill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[60] grid place-items-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="pointer-events-auto relative w-full max-w-md rounded-3xl bg-background shadow-float border border-border p-8"
            >
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 size-9 grid place-items-center rounded-full hover:bg-secondary"
                aria-label="Закрыть"
              >
                <X className="size-5" />
              </button>

              <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft mb-5">
                <LogIn className="size-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-extrabold text-primary tracking-tight">Вход в кабинет</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Войдите, чтобы отслеживать заказы, бонусы и оптовые цены.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Логин</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1.5 w-full h-12 px-4 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden transition"
                    placeholder="Ваш логин"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full h-12 px-4 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden transition"
                    placeholder="••••••"
                  />
                </div>
                {err && <div className="text-sm text-destructive">{err}</div>}
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-float transition-all"
                >
                  Войти
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  <ShieldCheck className="size-4" /> Demo-доступы (клик — подставить)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fill("Админ", "123")}
                    className="text-left px-3 py-2.5 rounded-2xl bg-secondary hover:bg-accent transition text-xs"
                  >
                    <div className="font-bold text-primary">Админ</div>
                    <div className="text-muted-foreground">Админ / 123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fill("Клиент", "123")}
                    className="text-left px-3 py-2.5 rounded-2xl bg-secondary hover:bg-accent transition text-xs"
                  >
                    <div className="font-bold text-primary">Клиент</div>
                    <div className="text-muted-foreground">любой логин</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
