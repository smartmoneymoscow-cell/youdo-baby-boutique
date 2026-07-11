import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "new";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Популярные" },
  { key: "new", label: "Новинки" },
  { key: "price-asc", label: "Сначала дешевле" },
  { key: "price-desc", label: "Сначала дороже" },
];

export function Catalog() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (query && !`${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (activeCat && p.category !== activeCat) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list.slice(0, 8);
  }, [query, activeCat, sort]);

  return (
    <section id="catalog" className="relative px-4 md:px-6 lg:px-10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-soft font-semibold">Витрина</div>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
              Выберите лучшее <span className="italic font-serif font-medium text-primary-soft">для малыша</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Показываем избранное. Более 5 000 товаров ждут вас в полном каталоге.
            </p>
          </div>
          <Link
            to="/catalog"
            className="shrink-0 inline-flex items-center gap-2 h-13 px-6 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all"
          >
            Открыть весь каталог <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Toolbar: search + sort + category chips */}
        <div className="rounded-3xl bg-card border border-border/70 p-4 md:p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию или бренду"
                className="w-full h-13 py-3.5 pl-12 pr-4 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background outline-hidden text-[15px] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
                Сортировка
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-13 py-3.5 pl-4 pr-9 rounded-2xl bg-secondary/60 border border-transparent focus:border-primary/40 focus:bg-background text-[14px] font-medium outline-hidden transition-all"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active={!activeCat} onClick={() => setActiveCat(null)}>Все</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(activeCat === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch"
        >
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="h-full"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all"
          >
            Смотреть весь каталог 5 000+ товаров <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border text-foreground/80 hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
