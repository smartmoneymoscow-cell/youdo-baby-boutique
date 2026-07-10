import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { motion } from "motion/react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Bestsellers() {
  const items = PRODUCTS.filter((p) => p.isBestseller || p.rating >= 4.8);
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="bestsellers" className="relative px-4 md:px-6 lg:px-10 pt-6 md:pt-10 pb-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-soft font-semibold">Топ продаж</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              Бестселлеры <span className="italic font-serif font-medium text-primary-soft">этой недели</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="size-11 rounded-full bg-card border border-border grid place-items-center hover:border-primary/40 hover:text-primary">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => scroll(1)} className="size-11 rounded-full bg-card border border-border grid place-items-center hover:border-primary/40 hover:text-primary">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <motion.div
          ref={ref}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[260px] md:w-[300px]">
              <ProductCard product={p} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
