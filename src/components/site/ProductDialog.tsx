import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Heart, Star, Plus, Minus, ShieldCheck, Truck, RotateCcw, Building2 } from "lucide-react";
import { useShop, useUI } from "@/lib/store";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { toast } from "sonner";

export function ProductDialog() {
  const { activeProductId, setActiveProduct, bumpCart } = useUI();
  const { addToCart, favorites, toggleFavorite } = useShop();
  const product = PRODUCTS.find((p) => p.id === activeProductId);

  const [color, setColor] = useState<string | undefined>();
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setColor(product.colors[0]?.name);
      setSize(product.sizes?.[0]);
      setQty(1);
    }
  }, [product]);

  const isFav = product ? favorites.includes(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProduct(null)}
            className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-5xl bg-background rounded-t-3xl md:rounded-[36px] shadow-float overflow-hidden max-h-[95vh] md:max-h-[88vh] flex flex-col md:flex-row">
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 z-10 size-10 grid place-items-center rounded-full bg-background/95 backdrop-blur border border-border shadow-sm hover:bg-secondary"
              >
                <X className="size-5" />
              </button>

              <div className="relative md:w-1/2 aspect-square md:aspect-auto bg-gradient-soft shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.isBestseller && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground">Хит</span>
                  )}
                  {product.isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cream text-primary">Новинка</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary-soft font-bold">{product.brand}</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-primary tracking-tight leading-tight">
                  {product.name}
                </h2>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-cream stroke-primary/60" />
                    <span className="font-bold text-foreground">{product.rating}</span>
                  </span>
                  <span className="text-muted-foreground">{product.reviews} отзывов</span>
                  <span className="text-muted-foreground">· {product.ageGroup}</span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-extrabold text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-base text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>

                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">Цвет: <span className="text-foreground">{color}</span></div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setColor(c.name)}
                        className={`size-10 rounded-full border-2 transition-all ${
                          color === c.name ? "border-primary scale-110 ring-4 ring-primary/15" : "border-border"
                        }`}
                        style={{ background: c.hex }}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>

                {product.sizes && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">Размер</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`h-11 min-w-14 px-4 rounded-2xl border text-sm font-semibold transition-all ${
                            size === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border text-foreground/80 hover:border-primary/40"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-border bg-card">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="size-11 grid place-items-center hover:text-primary">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="size-11 grid place-items-center hover:text-primary">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, { color, size, qty });
                      bumpCart();
                      toast.success("Добавлено в корзину");
                    }}
                    className="flex-1 h-12 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-float transition-all"
                  >
                    Добавить в корзину
                  </button>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="size-12 grid place-items-center rounded-full bg-card border border-border hover:border-primary/40"
                    aria-label="В избранное"
                  >
                    <Heart className={`size-5 ${isFav ? "fill-destructive text-destructive" : "text-foreground/70"}`} />
                  </button>
                </div>

                <button
                  onClick={() => toast.success("Заявка на оптовые цены отправлена. Мы свяжемся с вами.")}
                  className="mt-3 w-full h-12 rounded-full bg-cream text-primary font-semibold border border-primary/10 hover:bg-cream/80 inline-flex items-center justify-center gap-2"
                >
                  <Building2 className="size-4" /> Запросить оптовые цены
                </button>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  <Bene icon={Truck} label="Доставка 1-3 дня" />
                  <Bene icon={ShieldCheck} label="Гарантия качества" />
                  <Bene icon={RotateCcw} label="Возврат 30 дней" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Bene({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-soft">
      <Icon className="size-5 text-primary" />
      <span className="text-[11px] font-semibold text-foreground/80 leading-tight">{label}</span>
    </div>
  );
}
