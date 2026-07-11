import { Link } from "@tanstack/react-router";
import { Instagram, Send, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Премиальный магазин детских товаров. 5 000+ SKU, ИИ-консультант, бонусная программа и быстрая доставка по всей России.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Send, Facebook, Youtube].map((I, i) => (
              <a
                key={i}
                href="#"
                className="size-10 rounded-full bg-background border border-border grid place-items-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
              >
                <I className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Магазин</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/catalog" className="text-foreground/70 hover:text-primary">Каталог</Link></li>
            <li><a href="/#bestsellers" className="text-foreground/70 hover:text-primary">Бестселлеры</a></li>
            <li><a href="/#promo" className="text-foreground/70 hover:text-primary">Акции и новинки</a></li>
            <li><Link to="/account" className="text-foreground/70 hover:text-primary">Личный кабинет</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Компания</div>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="text-foreground/70 hover:text-primary">О нас</a></li>
            <li><a href="#" className="text-foreground/70 hover:text-primary">Доставка</a></li>
            <li><a href="#" className="text-foreground/70 hover:text-primary">Оплата</a></li>
            <li><a href="#" className="text-foreground/70 hover:text-primary">Контакты</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/80">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Заказ с YouDo. Все права защищены.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
