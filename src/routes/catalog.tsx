import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X, ChevronRight, Home, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AGE_GROUPS, BRANDS, CATEGORIES, PRODUCTS, formatPrice } from "@/lib/products";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { FavoritesDrawer } from "@/components/site/FavoritesDrawer";
import { ProductDialog } from "@/components/site/ProductDialog";
import { ChatWidget } from "@/components/site/ChatWidget";
import { ProductCard } from "@/components/site/ProductCard";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/catalog")({
  component: CatalogPage,
  head: () => ({
    meta: [
      { title: "Каталог — Заказ с YouDo" },
      { name: "description", content: "Полный каталог детских товаров: 5 000+ позиций, удобные фильтры, поиск и сортировка." },
      { property: "og:title", content: "Каталог — Заказ с YouDo" },
      { property: "og:description", content: "Полный каталог детских товаров: 5 000+ позиций, удобные фильтры, поиск и сортировка." },
    ],
  }),
});

type SortKey = "popular" | "price-asc" | "price-desc" | "new" | "rating";

const PER_PAGE = 24;

function CatalogPage() {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStock, setInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, cats, ages, brands, maxPrice, inStock, onlySale, sort]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (query && !`${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (ages.length && !ages.includes(p.ageGroup)) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      if (inStock && p.stock <= 0) return false;
      if (onlySale && !p.oldPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [query, cats, ages, brands, maxPrice, inStock, onlySale, sort]);

  const visible = filtered.slice(0, page * PER_PAGE);
  const activeCount = cats.length + ages.length + brands.length + (maxPrice < 100000 ? 1 : 0) + (inStock ? 1 : 0) + (onlySale ? 1 : 0);

  const toggle = (v: string, arr: string[], set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setCats([]);
    setAges([]);
    setBrands([]);
    setMaxPrice(100000);
    setInStock(false);
    setOnlySale(false);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 md:px-6 lg:px-10 py-8 md:py-12">
        <div className="mx-auto max-w-[1400px]">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary inline-flex items-center gap-1"><Home className="size-3.5" /> Главная</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Каталог</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
                Каталог <span className="italic font-serif font-medium text-primary-soft">Заказ с YouDo</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> из {PRODUCTS.length} товаров
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 md:flex-none md:min-w-[360px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти в каталоге…"
                  className="w-full h-12 pl-11 pr-4 rounded-full bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden text-sm transition-all"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-12 pl-4 pr-9 rounded-full bg-card border border-border text-sm font-medium outline-hidden focus:border-primary/40"
              >
                <option value="popular">По популярности</option>
                <option value="rating">По рейтингу</option>
                <option value="new">Сначала новинки</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
              </select>
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 h-12 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
              >
                <SlidersHorizontal className="size-4" />
                Фильтры {activeCount > 0 && <span className="ml-1 size-5 rounded-full bg-primary-foreground text-primary text-[10px] grid place-items-center font-bold">{activeCount}</span>}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {[...cats, ...ages, ...brands].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {f}
                  <button
                    onClick={() => {
                      if (cats.includes(f)) setCats(cats.filter((x) => x !== f));
                      if (ages.includes(f)) setAges(ages.filter((x) => x !== f));
                      if (brands.includes(f)) setBrands(brands.filter((x) => x !== f));
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs font-semibold text-primary-soft hover:text-primary underline underline-offset-4">
                Сбросить всё
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className="hidden lg:block">
              <FilterPanel
                cats={cats}
                ages={ages}
                brands={brands}
                maxPrice={maxPrice}
                inStock={inStock}
                onlySale={onlySale}
                toggleCat={(v) => toggle(v, cats, setCats)}
                toggleAge={(v) => toggle(v, ages, setAges)}
                toggleBrand={(v) => toggle(v, brands, setBrands)}
                setMaxPrice={setMaxPrice}
                setInStock={setInStock}
                setOnlySale={setOnlySale}
                onClear={clearAll}
              />
            </aside>

            <div>
              {visible.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
                  Ничего не найдено. Попробуйте изменить фильтры.
                </div>
              ) : (
                <>
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.02 } } }}
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 items-stretch"
                  >
                    {visible.map((p) => (
                      <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="h-full">
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                  </motion.div>
                  {visible.length < filtered.length && (
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-card border border-border font-semibold hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <Loader2 className="size-4" />
                        Показать ещё {Math.min(PER_PAGE, filtered.length - visible.length)}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-primary">Фильтры</h3>
                <button onClick={() => setFiltersOpen(false)} className="size-9 grid place-items-center rounded-full bg-secondary">
                  <X className="size-4" />
                </button>
              </div>
              <FilterPanel
                cats={cats}
                ages={ages}
                brands={brands}
                maxPrice={maxPrice}
                inStock={inStock}
                onlySale={onlySale}
                toggleCat={(v) => toggle(v, cats, setCats)}
                toggleAge={(v) => toggle(v, ages, setAges)}
                toggleBrand={(v) => toggle(v, brands, setBrands)}
                setMaxPrice={setMaxPrice}
                setInStock={setInStock}
                setOnlySale={setOnlySale}
                onClear={clearAll}
                embedded
              />
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full h-13 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-semibold"
              >
                Показать {filtered.length} товаров
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <ProductDialog />
      <ChatWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function FilterPanel({
  cats,
  ages,
  brands,
  maxPrice,
  inStock,
  onlySale,
  toggleCat,
  toggleAge,
  toggleBrand,
  setMaxPrice,
  setInStock,
  setOnlySale,
  onClear,
  embedded,
}: {
  cats: string[];
  ages: string[];
  brands: string[];
  maxPrice: number;
  inStock: boolean;
  onlySale: boolean;
  toggleCat: (v: string) => void;
  toggleAge: (v: string) => void;
  toggleBrand: (v: string) => void;
  setMaxPrice: (v: number) => void;
  setInStock: (v: boolean) => void;
  setOnlySale: (v: boolean) => void;
  onClear: () => void;
  embedded?: boolean;
}) {
  const content = (
    <div className="space-y-7">
      <Section title="Категория">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={cats.includes(c)} onClick={() => toggleCat(c)}>{c}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Возраст">
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => (
            <Chip key={a} active={ages.includes(a)} onClick={() => toggleAge(a)}>{a}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Бренд">
        <div className="max-h-52 overflow-y-auto pr-1 space-y-1.5">
          {BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="size-4 accent-primary"
              />
              {b}
            </label>
          ))}
        </div>
      </Section>

      <Section title={`Цена до · ${formatPrice(maxPrice)}`}>
        <input
          type="range"
          min={1000}
          max={100000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </Section>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="size-4 accent-primary" />
          В наличии
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} className="size-4 accent-primary" />
          Только со скидкой
        </label>
      </div>

      <button
        onClick={onClear}
        className="text-sm font-semibold text-primary-soft hover:text-primary underline underline-offset-4"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="sticky top-24 rounded-3xl bg-card border border-border/70 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-lg font-extrabold text-primary mb-5">Фильтры</h3>
      {content}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border text-foreground/80 hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
