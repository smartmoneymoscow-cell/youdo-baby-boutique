import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Gift, ClipboardList, User, Home, ChevronRight, Package, Sparkles, LogOut } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { FavoritesDrawer } from "@/components/site/FavoritesDrawer";
import { ProductDialog } from "@/components/site/ProductDialog";
import { ChatWidget } from "@/components/site/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth";
import { useOrders, type OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Личный кабинет — Заказ с YouDo" },
      { name: "description", content: "История заказов и бонусная программа Заказ с YouDo." },
    ],
  }),
});

const STATUS_COLOR: Record<OrderStatus, string> = {
  Новый: "bg-sky text-primary",
  Собран: "bg-cream text-primary",
  "В доставке": "bg-primary/15 text-primary",
  Доставлен: "bg-emerald-100 text-emerald-700",
  Отменён: "bg-blush text-primary",
};

function AccountPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const updateProfile = useAuth((s) => s.updateProfile);
  const orders = useOrders((s) => s.orders);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "bonuses" | "profile">("orders");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) {
      navigate({ to: "/" });
      return;
    }
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user, navigate]);

  if (!user) return null;

  const myOrders = orders.filter((o) => o.customer === user.name || user.role === "admin").slice(0, 20);
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 md:px-6 lg:px-10 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary inline-flex items-center gap-1"><Home className="size-3.5" /> Главная</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Личный кабинет</span>
          </nav>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-gradient-primary text-primary-foreground p-6 md:p-10 mb-8 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] opacity-70">Добрый день,</div>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{user.name}</h1>
                <p className="mt-2 text-primary-foreground/80 max-w-md text-sm">
                  Уровень «Premium Baby» · вы с нами уже 8 месяцев. Продолжайте копить бонусы!
                </p>
              </div>
              <div className="flex gap-3">
                <Stat label="Заказов" value={myOrders.length} />
                <Stat label="Потрачено" value={formatPrice(totalSpent)} />
                <Stat label="Бонусы" value={`${user.bonuses.toLocaleString("ru-RU")} ₽`} highlight />
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Tab active={tab === "orders"} onClick={() => setTab("orders")} icon={ClipboardList}>Мои заказы</Tab>
            <Tab active={tab === "bonuses"} onClick={() => setTab("bonuses")} icon={Gift}>Бонусы</Tab>
            <Tab active={tab === "profile"} onClick={() => setTab("profile")} icon={User}>Профиль</Tab>
            <button
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="ml-auto inline-flex items-center gap-2 h-11 px-4 rounded-full bg-card border border-border text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" /> Выйти
            </button>
          </div>

          {tab === "orders" && (
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
                  У вас пока нет заказов. <Link to="/catalog" className="text-primary font-semibold underline underline-offset-2">Перейти в каталог</Link>
                </div>
              ) : (
                myOrders.map((o) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-card border border-border p-5 md:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="size-4" /> Заказ №{o.id}
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_COLOR[o.status]}`}>
                            {o.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-primary">{formatPrice(o.total)}</div>
                        <div className="text-xs text-primary-soft">+{o.bonusesEarned} ₽ бонусов</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/60 text-sm text-foreground/80">
                      {o.items.map((it) => `${it.name} × ${it.qty}`).join(", ")}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {tab === "bonuses" && (
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 rounded-3xl bg-card border border-border p-6 md:p-8">
                <h3 className="text-xl font-extrabold text-primary">Программа лояльности</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Копите бонусы с каждой покупки — 5% от суммы. 1 бонус = 1 ₽ при оплате следующего заказа.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    { name: "Baby", threshold: 0, cashback: "3%" },
                    { name: "Premium", threshold: 30000, cashback: "5%", current: true },
                    { name: "Gold", threshold: 100000, cashback: "8%" },
                  ].map((lvl) => (
                    <div key={lvl.name} className={`p-4 rounded-2xl border ${lvl.current ? "border-primary bg-primary/5" : "border-border"}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-primary">{lvl.name} {lvl.current && <span className="ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Текущий</span>}</div>
                        <div className="text-sm text-muted-foreground">Кэшбек {lvl.cashback}</div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">От {formatPrice(lvl.threshold)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-6 md:p-8">
                <div className="text-xs uppercase tracking-widest opacity-70">Ваш баланс</div>
                <div className="mt-2 text-4xl font-extrabold flex items-center gap-2"><Sparkles className="size-6" /> {user.bonuses.toLocaleString("ru-RU")}</div>
                <div className="text-sm opacity-80">бонусов</div>
                <div className="mt-6 text-xs opacity-80">
                  До уровня Gold осталось накопить {Math.max(0, 100000 - totalSpent).toLocaleString("ru-RU")} ₽ покупок.
                </div>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-2xl rounded-3xl bg-card border border-border p-6 md:p-8">
              <h3 className="text-xl font-extrabold text-primary mb-6">Личные данные</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Имя" value={name} onChange={setName} />
                <Field label="Email" value={email} onChange={setEmail} />
                <Field label="Телефон" value={phone} onChange={setPhone} />
              </div>
              <button
                onClick={() => { updateProfile({ name, email, phone }); }}
                className="mt-6 h-12 px-8 rounded-full bg-gradient-primary text-primary-foreground font-semibold"
              >
                Сохранить
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <ProductDialog />
      <ChatWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl px-5 py-3 min-w-[110px] ${highlight ? "bg-cream text-primary" : "bg-white/15"}`}>
      <div className={`text-[10px] uppercase tracking-widest ${highlight ? "text-primary/60" : "opacity-70"}`}>{label}</div>
      <div className="text-lg font-extrabold">{value}</div>
    </div>
  );
}

function Tab({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border text-foreground/80 hover:border-primary/40"
      }`}
    >
      <Icon className="size-4" /> {children}
    </button>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-12 px-4 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden"
      />
    </div>
  );
}
