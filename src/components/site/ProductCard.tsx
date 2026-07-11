import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useShop, useUI } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useShop();
  const { bumpCart, setActiveProduct } = useUI();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFav = favorites.includes(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = cardRef.current?.getBoundingClientRect();
    const cartBtn = document.getElementById("cart-button")?.getBoundingClientRect();
    if (rect && cartBtn) {
      const flyer = document.createElement("div");
      flyer.style.cssText = `
        position:fixed;left:${rect.left + rect.width / 2 - 24}px;top:${rect.top + 40}px;
        width:48px;height:48px;border-radius:50%;
        background-image:url(${product.image});background-size:cover;background-position:center;
        z-index:100;pointer-events:none;transition:all 0.85s cubic-bezier(.5,-.2,.7,1);
        box-shadow:0 10px 30px -8px rgba(0,0,0,.3);
      `;
      document.body.appendChild(flyer);
      requestAnimationFrame(() => {
        flyer.style.left = `${cartBtn.left + 8}px`;
        flyer.style.top = `${cartBtn.top + 8}px`;
        flyer.style.width = "16px";
        flyer.style.height = "16px";
        flyer.style.opacity = "0.2";
      });
      setTimeout(() => flyer.remove(), 900);
    }
    addToCart(product);
    bumpCart();
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={() => setActiveProduct(product.id)}
      className="group relative flex flex-col rounded-3xl bg-card border border-border/70 overflow-hidden cursor-pointer hover:shadow-card hover:border-primary/30 transition-all h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-soft">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
              Хит
            </span>
          )}
          {product.isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cream text-primary shadow-sm">
              Новинка
            </span>
          )}
          {product.oldPrice && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blush text-primary shadow-sm">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label="В избранное"
          className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-background/90 backdrop-blur-md hover:bg-background shadow-sm transition-all"
        >
          <Heart
            className={`size-4 transition-all ${
              isFav ? "fill-destructive text-destructive scale-110" : "text-foreground/70"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-1.5 p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground font-semibold truncate">
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-0.5 text-foreground/70 shrink-0">
            <Star className="size-3 fill-cream stroke-primary/60" /> {product.rating}
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 h-11 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-soft transition-all hover:-translate-y-0.5"
        >
          <ShoppingBag className="size-4" /> В корзину
        </button>
      </div>
    </motion.div>
  );
}
