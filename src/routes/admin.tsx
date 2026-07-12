import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Home, ChevronRight, LayoutDashboard, Package, Download, Upload, Plus, Pencil, Trash2, TrendingUp, ShoppingCart, Coins, Users } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth";
import { useOrders, type OrderStatus } from "@/lib/orders";
import { PRODUCTS as SEED_PRODUCTS, formatPrice, type Product } from "@/lib/products";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Admin-editable product store (frontend-only, persists in localStorage).
type AdminProductState = {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  replaceAll: (list: Product[]) => void;
};
const useAdminProducts = create<AdminProductState>()(
  persist(
    (set) => ({
      products: SEED_PRODUCTS,
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      updateProduct: (id, patch) => set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removeProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      replaceAll: (list) => set({ products: list }),
    }),
    { name: "youdo-admin-products" },
  ),
);

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Админка — Заказ с YouDo" }] }),
});

function AdminPage() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"dashboard" | "products" | "orders" | "io">("dashboard");

  useEffect(() => {
    if (!user || user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-secondary/40">
      <Header />
      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 h-max rounded-3xl bg-primary text-primary-foreground p-5 shadow-float">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-10 rounded-2xl bg-white/15 grid place-items-center">
                  <LayoutDashboard className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest opacity-70">Admin panel</div>
                  <div className="text-base font-extrabold truncate">YouDo Console</div>
                </div>
              </div>

              <nav className="flex lg:flex-col gap-1 overflow-x-auto -mx-1 px-1">
                <SideTab active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={LayoutDashboard}>Статистика</SideTab>
                <SideTab active={tab === "products"} onClick={() => setTab("products")} icon={Package}>База товаров</SideTab>
                <SideTab active={tab === "orders"} onClick={() => setTab("orders")} icon={ShoppingCart}>Заказы</SideTab>
                <SideTab active={tab === "io"} onClick={() => setTab("io")} icon={Download}>Импорт / Экспорт</SideTab>
              </nav>

              <div className="mt-6 pt-5 border-t border-white/15">
                <div className="text-[11px] uppercase tracking-widest opacity-70">Вы вошли как</div>
                <div className="mt-1 text-sm font-bold truncate">{user.name}</div>
                <div className="text-xs opacity-80">Администратор</div>
              </div>
            </aside>

            <section className="min-w-0">
              <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <Link to="/" className="hover:text-primary inline-flex items-center gap-1"><Home className="size-3.5" /> Главная</Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground font-medium">
                  {tab === "dashboard" && "Статистика"}
                  {tab === "products" && "База товаров"}
                  {tab === "orders" && "Заказы"}
                  {tab === "io" && "Импорт / Экспорт"}
                </span>
              </nav>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.2em] text-primary-soft font-semibold">Панель управления</div>
                <h1 className="mt-1.5 text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                  {tab === "dashboard" && "Статистика магазина"}
                  {tab === "products" && "База товаров и карточки"}
                  {tab === "orders" && "Заказы клиентов"}
                  {tab === "io" && "Импорт и экспорт базы"}
                </h1>
              </div>

              {tab === "dashboard" && <Dashboard />}
              {tab === "products" && <ProductsTab onGoIO={() => setTab("io")} />}
              {tab === "orders" && <OrdersTab />}
              {tab === "io" && <IOTab />}
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function SideTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 lg:w-full flex items-center gap-2.5 px-3.5 h-11 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-white text-primary shadow-sm"
          : "text-primary-foreground/85 hover:bg-white/10"
      }`}
    >
      <Icon className="size-4" /> {children}
    </button>
  );
}


function Dashboard() {
  const orders = useOrders((s) => s.orders);
  const products = useAdminProducts((s) => s.products);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgCheck = orders.length ? Math.round(revenue / orders.length) : 0;
  const bonuses = orders.reduce((s, o) => s + o.bonusesEarned, 0);

  // Simple last-7-days bar chart
  const days = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    return Array.from({ length: 7 }).map((_, i) => {
      const start = now - (6 - i) * day;
      const end = start + day;
      const dayOrders = orders.filter((o) => o.createdAt >= start - day * 30 && o.createdAt < end + day * 30);
      // Since we only have a few seed orders, distribute pseudo-random values for visualization.
      const value = dayOrders.length + Math.floor(Math.sin(i + 1) * 3 + 5);
      return { label: new Date(start).toLocaleDateString("ru-RU", { weekday: "short" }), value };
    });
  }, [orders]);
  const max = Math.max(...days.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Заказы" value={orders.length} tint="bg-primary/10 text-primary" />
        <StatCard icon={TrendingUp} label="Выручка" value={formatPrice(revenue)} tint="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Coins} label="Средний чек" value={formatPrice(avgCheck)} tint="bg-cream text-primary" />
        <StatCard icon={Users} label="Товаров в базе" value={products.length} tint="bg-blush text-primary" />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <div className="rounded-3xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-primary">Заказы за 7 дней</h3>
            <span className="text-xs text-muted-foreground">Демо-данные</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-52">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / max) * 100}%` }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-xl bg-gradient-primary min-h-[8px]"
                />
                <span className="text-[11px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest opacity-70">Начислено бонусов</div>
          <div className="mt-2 text-4xl font-extrabold">{bonuses.toLocaleString("ru-RU")} ₽</div>
          <p className="mt-4 text-sm opacity-80">Всего клиентам за все время работы магазина в рамках программы лояльности.</p>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ onGoIO }: { onGoIO: () => void }) {
  const products = useAdminProducts((s) => s.products);
  const addProduct = useAdminProducts((s) => s.addProduct);
  const updateProduct = useAdminProducts((s) => s.updateProduct);
  const removeProduct = useAdminProducts((s) => s.removeProduct);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  const list = products.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase())).slice(0, 100);

  const startNew = () => {
    setEditing({
      id: `n${Date.now()}`,
      name: "",
      brand: "YOUDO Premium",
      category: "Игрушки",
      ageGroup: "0-6 мес",
      price: 1000,
      image: products[0]?.image ?? "",
      rating: 5,
      reviews: 0,
      stock: 0,
      description: "",
      colors: [{ name: "Ваниль", hex: "#f3e7cf" }],
    });
  };

  const save = () => {
    if (!editing) return;
    const exists = products.find((p) => p.id === editing.id);
    if (exists) updateProduct(editing.id, editing);
    else addProduct(editing);
    setEditing(null);
    toast.success("Товар сохранён");
  };

  return (
    <div className="space-y-4">
      {/* Stat + primary actions row */}
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-center rounded-3xl bg-card border border-border p-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">В базе</div>
          <div className="text-2xl font-extrabold text-primary">{products.length} товаров</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={startNew}
            className="h-11 px-5 rounded-full bg-gradient-primary text-primary-foreground font-semibold inline-flex items-center gap-2 shadow-soft"
          >
            <Plus className="size-4" /> Новый товар
          </button>
          <button
            onClick={onGoIO}
            className="h-11 px-5 rounded-full bg-secondary hover:bg-secondary/80 text-primary font-semibold inline-flex items-center gap-2 border border-border"
          >
            <Download className="size-4" /> Экспорт CSV
          </button>
          <button
            onClick={onGoIO}
            className="h-11 px-5 rounded-full bg-secondary hover:bg-secondary/80 text-primary font-semibold inline-flex items-center gap-2 border border-border"
          >
            <Upload className="size-4" /> Импорт CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию или бренду"
          className="flex-1 min-w-[220px] h-12 px-4 rounded-full bg-background border border-border focus:border-primary/40 outline-hidden text-sm"
        />
      </div>



      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Товар</th>
                <th className="text-left px-4 py-3">Бренд</th>
                <th className="text-left px-4 py-3">Категория</th>
                <th className="text-right px-4 py-3">Цена</th>
                <th className="text-right px-4 py-3">Остаток</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-border/60 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-soft overflow-hidden shrink-0">
                        <img src={p.image} className="size-full object-cover" alt="" />
                      </div>
                      <div className="font-medium text-foreground line-clamp-1">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(p)} className="size-9 grid place-items-center rounded-full hover:bg-primary/10 text-primary"><Pencil className="size-4" /></button>
                      <button onClick={() => { if (confirm("Удалить?")) removeProduct(p.id); }} className="size-9 grid place-items-center rounded-full hover:bg-destructive/10 text-destructive"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 text-xs text-muted-foreground text-center">Показано {list.length} из {products.length}</div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md grid place-items-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-float border border-border">
            <h3 className="text-xl font-extrabold text-primary mb-4">{products.find((p) => p.id === editing.id) ? "Редактировать" : "Новый товар"}</h3>
            <div className="grid gap-3">
              <AdminField label="Название" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <AdminField label="Бренд" value={editing.brand} onChange={(v) => setEditing({ ...editing, brand: v })} />
              <div className="grid grid-cols-2 gap-3">
                <AdminField label="Цена" value={String(editing.price)} onChange={(v) => setEditing({ ...editing, price: Number(v) || 0 })} />
                <AdminField label="Остаток" value={String(editing.stock)} onChange={(v) => setEditing({ ...editing, stock: Number(v) || 0 })} />
              </div>
              <AdminField label="Описание" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setEditing(null)} className="h-11 px-5 rounded-full bg-secondary font-medium">Отмена</button>
              <button onClick={save} className="h-11 px-6 rounded-full bg-gradient-primary text-primary-foreground font-semibold">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const orders = useOrders((s) => s.orders);
  const setStatus = useOrders((s) => s.setStatus);
  const statuses: OrderStatus[] = ["Новый", "Собран", "В доставке", "Доставлен", "Отменён"];
  return (
    <div className="rounded-3xl bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">№</th>
              <th className="text-left px-4 py-3">Дата</th>
              <th className="text-left px-4 py-3">Клиент</th>
              <th className="text-right px-4 py-3">Сумма</th>
              <th className="text-left px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-bold text-primary">{o.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-right font-bold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                    className="h-9 px-3 rounded-full bg-secondary text-xs font-semibold border-none outline-hidden"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IOTab() {
  const products = useAdminProducts((s) => s.products);
  const replaceAll = useAdminProducts((s) => s.replaceAll);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportCsv = () => {
    const csv = Papa.unparse(
      products.map((p) => ({
        id: p.id, name: p.name, brand: p.brand, category: p.category,
        ageGroup: p.ageGroup, price: p.price, oldPrice: p.oldPrice ?? "",
        stock: p.stock, rating: p.rating, description: p.description,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `youdo-products-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Экспортировано ${products.length} товаров`);
  };

  const importCsv = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      complete: (res) => {
        const items: Product[] = res.data
          .filter((r) => r.name)
          .map((r) => ({
            id: r.id || `i${Date.now()}${Math.random()}`,
            name: r.name,
            brand: r.brand || "YOUDO",
            category: (r.category as Product["category"]) || "Игрушки",
            ageGroup: (r.ageGroup as Product["ageGroup"]) || "0-6 мес",
            price: Number(r.price) || 0,
            oldPrice: r.oldPrice ? Number(r.oldPrice) : undefined,
            stock: Number(r.stock) || 0,
            rating: Number(r.rating) || 5,
            reviews: 0,
            image: products[0]?.image ?? "",
            description: r.description || "",
            colors: [{ name: "Ваниль", hex: "#f3e7cf" }],
          }));
        replaceAll(items);
        toast.success(`Импортировано ${items.length} товаров`);
      },
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="rounded-3xl bg-card border border-border p-8">
        <Download className="size-8 text-primary mb-4" />
        <h3 className="text-xl font-extrabold text-primary">Экспорт базы</h3>
        <p className="mt-2 text-sm text-muted-foreground">Выгрузите весь каталог в CSV. Формат совместим с Excel и 1С.</p>
        <button onClick={exportCsv} className="mt-5 h-12 px-6 rounded-full bg-gradient-primary text-primary-foreground font-semibold">
          Скачать CSV ({products.length})
        </button>
      </div>
      <div className="rounded-3xl bg-card border border-border p-8">
        <Upload className="size-8 text-primary mb-4" />
        <h3 className="text-xl font-extrabold text-primary">Импорт базы</h3>
        <p className="mt-2 text-sm text-muted-foreground">Загрузите CSV. Заголовки: id, name, brand, category, ageGroup, price, stock, rating, description.</p>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} className="mt-5 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold">
          Выбрать файл
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }: { icon: React.ElementType; label: string; value: string | number; tint: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-card border border-border p-5"
    >
      <div className={`inline-flex size-11 rounded-2xl items-center justify-center ${tint}`}>
        <Icon className="size-5" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-primary">{value}</div>
    </motion.div>
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

function AdminField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full h-11 px-4 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden"
        />
      )}
    </div>
  );
}
