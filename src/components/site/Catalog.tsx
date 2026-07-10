import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AGE_GROUPS, CATEGORIES, PRODUCTS, formatPrice } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";

type SortKey = "popular" | "price-asc" | "price-desc" | "new";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (query && !`${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (ages.length && !ages.includes(p.ageGroup)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === "popular")
      list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [query, cats, ages, maxPrice, sort]);

  const toggle = (v: string, arr: string[], set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setCats([]);
    setAges([]);
    setMaxPrice(100000);
    setQuery("");
  };

  const activeFilters = cats.length + ages.length + (maxPrice < 100000 ? 1 : 0);

  return (
    <section id="catalog" className="relative px-4 md:px-6 lg:px-10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-soft font-semibold">Каталог</div>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
              Выберите лучшее <span className="italic font-serif font-medium text-primary-soft">для малыша</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Более 5 000 товаров от проверенных брендов. Розница и опт — цены появятся после регистрации.
            </p>
          </div>
        </div>

        {/* Search + sort bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или бренду"
              className="w-full h-12 pl-11 pr-4 rounded-full bg-secondary/60 border border-transparent focus:border-primary/30 focus:bg-background outline-hidden text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="md:hidden inline-flex items-center gap-2 h-12 px-5 rounded-full bg-card border border-border text-sm font-semibold"
            >
              <SlidersHorizontal className="size-4" />
              Фильтры {activeFilters > 0 && <span className="ml-1 size-5 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center">{activeFilters}</span>}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-12 pl-4 pr-9 rounded-full bg-card border border-border text-sm font-medium outline-hidden focus:border-primary/40"
            >
              <option value="popular">Популярные</option>
              <option value="new">Новинки</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters */}
          <AnimatePresence>
            {(filtersOpen || typeof window === "undefined") && (
              <FilterPanel
                mobile
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                cats={cats}
                ages={ages}
                maxPrice={maxPrice}
                toggleCat={(v) => toggle(v, cats, setCats)}
                toggleAge={(v) => toggle(v, ages, setAges)}
                setMaxPrice={setMaxPrice}
                onClear={clearAll}
              />
            )}
          </AnimatePresence>
          <aside className="hidden lg:block">
            <FilterPanel
              cats={cats}
              ages={ages}
              maxPrice={maxPrice}
              toggleCat={(v) => toggle(v, cats, setCats)}
              toggleAge={(v) => toggle(v, ages, setAges)}
              setMaxPrice={setMaxPrice}
              onClear={clearAll}
            />
          </aside>

          <div>
            <div className="text-sm text-muted-foreground mb-4">
              Найдено: <span className="font-semibold text-foreground">{filtered.length}</span> товаров
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
                Ничего не найдено. Попробуйте изменить фильтры.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  mobile,
  open,
  onClose,
  cats,
  ages,
  maxPrice,
  toggleCat,
  toggleAge,
  setMaxPrice,
  onClear,
}: {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
  cats: string[];
  ages: string[];
  maxPrice: number;
  toggleCat: (v: string) => void;
  toggleAge: (v: string) => void;
  setMaxPrice: (v: number) => void;
  onClear: () => void;
}) {
  const content = (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Категория</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = cats.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground/80 hover:border-primary/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">Возраст</h4>
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => {
            const active = ages.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAge(a)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground/80 hover:border-primary/40"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Цена до</h4>
          <span className="text-sm font-bold text-primary">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={100000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <button
        onClick={onClear}
        className="text-sm font-semibold text-primary-soft hover:text-primary underline underline-offset-4"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  if (mobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={`lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm ${open ? "" : "pointer-events-none"}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: open ? 0 : "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-primary">Фильтры</h3>
            <button onClick={onClose} className="size-9 grid place-items-center rounded-full bg-secondary">
              <X className="size-4" />
            </button>
          </div>
          {content}
          <button
            onClick={onClose}
            className="mt-8 w-full h-12 rounded-full bg-gradient-primary text-primary-foreground font-semibold"
          >
            Показать результаты
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="sticky top-24 rounded-3xl bg-card border border-border/70 p-6">
      <h3 className="text-lg font-extrabold text-primary mb-6">Фильтры</h3>
      {content}
    </div>
  );
}
