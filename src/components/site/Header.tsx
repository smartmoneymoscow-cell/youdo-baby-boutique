import { Heart, Search, ShoppingBag, User, Menu, Phone } from "lucide-react";
import { useShop, useUI } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Header() {
  const cart = useShop((s) => s.cart);
  const favorites = useShop((s) => s.favorites);
  const { setCartOpen, setFavOpen, cartBump } = useUI();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="hidden md:flex items-center justify-between px-6 lg:px-10 h-9 text-xs text-muted-foreground border-b border-border/40">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5"><Phone className="size-3" /> +7 (495) 000-00-00</span>
          <span>Доставка по России · Бесплатно от 5 000 ₽</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">Оптовикам</a>
          <a href="#" className="hover:text-foreground">Помощь</a>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 px-4 md:px-6 lg:px-10 h-16 md:h-20">
        <button className="md:hidden text-foreground" aria-label="Меню">
          <Menu className="size-6" />
        </button>

        <a href="#" className="flex items-center gap-2 shrink-0 group">
          <div className="size-9 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft">
            <svg viewBox="0 0 24 24" className="size-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12c2-4 6-6 8-6s6 2 8 6" />
              <circle cx="9" cy="13" r="1.2" fill="currentColor" />
              <circle cx="15" cy="13" r="1.2" fill="currentColor" />
              <path d="M9 17c1 1 4 1 6 0" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[15px] md:text-lg font-extrabold text-primary tracking-tight">Заказ с YouDo</div>
            <div className="hidden md:block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Premium baby store</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7 ml-4 text-sm font-medium text-foreground/80">
          <a href="#catalog" className="hover:text-primary transition-colors">Каталог</a>
          <a href="#bestsellers" className="hover:text-primary transition-colors">Бестселлеры</a>
          <a href="#brands" className="hover:text-primary transition-colors">Бренды</a>
          <a href="#wholesale" className="hover:text-primary transition-colors">Оптом</a>
        </nav>

        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary/70 border border-transparent focus:border-primary/30 focus:bg-background outline-hidden text-sm transition-all"
              placeholder="Найти коляску, кроватку, игрушку…"
              onFocus={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <button
            onClick={() => setFavOpen(true)}
            className="relative size-10 md:size-11 grid place-items-center rounded-full hover:bg-secondary transition-colors"
            aria-label="Избранное"
          >
            <Heart className="size-5 text-foreground" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-blush text-primary text-[10px] font-bold grid place-items-center border-2 border-background">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            id="cart-button"
            onClick={() => setCartOpen(true)}
            className="relative size-10 md:size-11 grid place-items-center rounded-full hover:bg-secondary transition-colors"
            aria-label="Корзина"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={cartBump}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 0.9, 1] }}
                transition={{ duration: 0.55 }}
                className="inline-flex"
              >
                <ShoppingBag className="size-5 text-foreground" />
              </motion.span>
            </AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                layout
                className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center border-2 border-background"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <Button
            variant="default"
            size="sm"
            className="hidden md:inline-flex rounded-full h-11 px-5 bg-gradient-primary shadow-soft hover:shadow-float transition-shadow"
          >
            <User className="size-4 mr-1.5" /> Войти
          </Button>
          <button
            className="md:hidden size-10 grid place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label="Войти"
          >
            <User className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
