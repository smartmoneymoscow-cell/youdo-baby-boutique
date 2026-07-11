import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useShop, useUI } from "@/lib/store";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { useAuth } from "@/lib/auth";
import { useOrders } from "@/lib/orders";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { cart, updateQty, removeFromCart, clearCart } = useShop();
  const user = useAuth((s) => s.user);
  const addBonuses = useAuth((s) => s.addBonuses);
  const createOrder = useOrders((s) => s.createOrder);
  const navigate = useNavigate();

  const items = cart.map((c, idx) => ({
    ...c,
    idx,
    product: PRODUCTS.find((p) => p.id === c.productId)!,
  }));
  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  const bonusesEarned = Math.round(subtotal * 0.05);

  const checkout = () => {
    if (!user) {
      toast.error("Войдите, чтобы оформить заказ");
      return;
    }
    if (items.length === 0) return;
    const order = createOrder({
      items: items.map((it) => ({
        productId: it.product.id,
        name: it.product.name,
        image: it.product.image,
        price: it.product.price,
        qty: it.qty,
        color: it.color,
        size: it.size,
      })),
      total: subtotal,
      bonusesEarned,
      bonusesUsed: 0,
      customer: user.name,
      address: "—",
    });
    addBonuses(bonusesEarned);
    clearCart();
    setCartOpen(false);
    toast.success(`Заказ ${order.id} оформлен! Начислено ${bonusesEarned} ₽ бонусов`);
    navigate({ to: "/account" });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-background shadow-float flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft">
                  <ShoppingBag className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-primary leading-tight">Корзина</h3>
                  <p className="text-xs text-muted-foreground">{items.length} товар(ов)</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="size-9 grid place-items-center rounded-full hover:bg-secondary transition-colors"
                aria-label="Свернуть корзину"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="size-24 rounded-full bg-gradient-soft grid place-items-center mb-5">
                    <ShoppingBag className="size-10 text-primary/50" />
                  </div>
                  <h4 className="text-lg font-bold text-primary">Корзина пуста</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Добавьте товары из каталога, чтобы оформить заказ.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 h-11 px-6 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft"
                  >
                    К каталогу
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={`${it.productId}-${it.color}-${it.size}`}
                        layout
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="group flex gap-3 p-3 rounded-2xl bg-card border border-border/70 hover:border-primary/30 transition-colors"
                      >
                        <div className="size-20 shrink-0 rounded-xl overflow-hidden bg-gradient-soft">
                          <img src={it.product.image} alt={it.product.name} className="size-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {it.product.brand}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                            {it.product.name}
                          </h4>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {it.color}{it.size ? ` · ${it.size}` : ""}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-border bg-background">
                              <button
                                onClick={() => updateQty(it.idx, it.qty - 1)}
                                className="size-7 grid place-items-center hover:text-primary"
                                aria-label="Уменьшить"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{it.qty}</span>
                              <button
                                onClick={() => updateQty(it.idx, it.qty + 1)}
                                className="size-7 grid place-items-center hover:text-primary"
                                aria-label="Увеличить"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <div className="text-sm font-extrabold text-primary">
                              {formatPrice(it.product.price * it.qty)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(it.idx)}
                          className="size-8 grid place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors self-start opacity-0 group-hover:opacity-100"
                          aria-label="Удалить"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-gradient-soft">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Промежуточный итог</span>
                  <span className="text-lg font-extrabold text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Доставка</span>
                  <span className="text-primary font-semibold">Бесплатно</span>
                </div>
                <button className="w-full h-13 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-float transition-all inline-flex items-center justify-center gap-2">
                  Оформить заказ <ArrowRight className="size-4" />
                </button>
                <div className="flex justify-between text-xs">
                  <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-primary underline underline-offset-2">
                    Продолжить покупки
                  </button>
                  <button onClick={clearCart} className="text-muted-foreground hover:text-destructive underline underline-offset-2">
                    Очистить
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
