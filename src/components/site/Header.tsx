import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, Menu, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop, useUI } from "@/lib/store";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { LoginDialog } from "./LoginDialog";

export function Header() {
  const cart = useShop((s) => s.cart);
  const favorites = useShop((s) => s.favorites);
  const { setCartOpen, setFavOpen, cartBump } = useUI();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const navLinks = [
    { to: "/catalog", label: "Каталог" },
    { to: "/", hash: "#bestsellers", label: "Бестселлеры" },
    { to: "/", hash: "#promo", label: "Акции" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/85 border-b border-border/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="hidden md:flex items-center justify-between px-6 lg:px-10 h-9 text-xs text-muted-foreground border-b border-border/40">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><Phone className="size-3" /> +7 (495) 000-00-00</span>
            <span>Доставка по России · Бесплатно от 5 000 ₽</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Помощь</a>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 px-4 md:px-6 lg:px-10 h-16 md:h-20 overflow-hidden">
          <button className="lg:hidden text-foreground shrink-0" aria-label="Меню" onClick={() => setMobileNav(true)}>
            <Menu className="size-6" />
          </button>

          <Link to="/" className="hidden lg:block">
            <Logo size={40} />
          </Link>
          <Link to="/" className="shrink-0 lg:hidden">
            <Logo size={36} showText={false} />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 ml-4 text-sm font-medium text-foreground/80 shrink-0">
            {navLinks.map((l) =>
              l.hash ? (
                <a key={l.label} href={l.hash} className="hover:text-primary transition-colors whitespace-nowrap">{l.label}</a>
              ) : (
                <Link key={l.label} to={l.to} className="hover:text-primary transition-colors whitespace-nowrap">{l.label}</Link>
              ),
            )}
          </nav>

          <div className="hidden md:flex flex-1 min-w-0 overflow-hidden">
            <Link to="/catalog" className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <div className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary/70 border border-transparent flex items-center text-sm text-muted-foreground truncate">
                Найти коляску, кроватку, игрушку…
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-2 justify-end shrink-0">
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

            <div className="shrink-0">
              <UserMenu onOpenLogin={() => setLoginOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
              className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background shadow-float p-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo size={36} />
                <button onClick={() => setMobileNav(false)} className="size-9 grid place-items-center rounded-full bg-secondary">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((l) =>
                  l.hash ? (
                    <a
                      key={l.label}
                      href={l.hash}
                      onClick={() => setMobileNav(false)}
                      className="px-3 py-3 rounded-xl hover:bg-secondary text-foreground font-medium"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setMobileNav(false)}
                      className="px-3 py-3 rounded-xl hover:bg-secondary text-foreground font-medium"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
