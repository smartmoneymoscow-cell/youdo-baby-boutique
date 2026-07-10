import { X, Heart, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useShop, useUI } from "@/lib/store";
import { PRODUCTS, formatPrice } from "@/lib/products";

export function FavoritesDrawer() {
  const { favOpen, setFavOpen, bumpCart } = useUI();
  const { favorites, toggleFavorite, addToCart } = useShop();

  const items = favorites
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  return (
    <AnimatePresence>
      {favOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFavOpen(false)}
            className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-background shadow-float flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-blush grid place-items-center">
                  <Heart className="size-5 fill-destructive text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-primary leading-tight">Избранное</h3>
                  <p className="text-xs text-muted-foreground">{items.length} товар(ов)</p>
                </div>
              </div>
              <button
                onClick={() => setFavOpen(false)}
                className="size-9 grid place-items-center rounded-full hover:bg-secondary transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="size-24 rounded-full bg-blush/60 grid place-items-center mb-5">
                    <Heart className="size-10 text-primary/50" />
                  </div>
                  <h4 className="text-lg font-bold text-primary">Пока пусто</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Отмечайте товары сердечком, чтобы вернуться к ним позже.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((p) => (
                      <motion.li
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="flex gap-3 p-3 rounded-2xl bg-card border border-border/70"
                      >
                        <div className="size-20 shrink-0 rounded-xl overflow-hidden bg-gradient-soft">
                          <img src={p.image} alt={p.name} className="size-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {p.brand}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                            {p.name}
                          </h4>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-primary">{formatPrice(p.price)}</span>
                            <button
                              onClick={() => {
                                addToCart(p);
                                bumpCart();
                              }}
                              className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-sm"
                            >
                              <Plus className="size-3" /> В корзину
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(p.id)}
                          className="size-8 grid place-items-center rounded-full text-muted-foreground hover:text-destructive self-start"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
