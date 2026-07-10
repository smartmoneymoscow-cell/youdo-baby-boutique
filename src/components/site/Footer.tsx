import { Instagram, Send, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-gradient-primary grid place-items-center">
              <svg viewBox="0 0 24 24" className="size-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 12c2-4 6-6 8-6s6 2 8 6" />
                <circle cx="9" cy="13" r="1.2" fill="currentColor" />
                <circle cx="15" cy="13" r="1.2" fill="currentColor" />
                <path d="M9 17c1 1 4 1 6 0" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-extrabold text-primary tracking-tight">Заказ с YouDo</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Premium baby store</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Премиальный B2B/B2C магазин детских товаров. 5 000+ SKU, оптовые цены, ИИ-консультант и быстрая доставка по всей России.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Send, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" className="size-10 rounded-full bg-background border border-border grid place-items-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors">
                <I className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Магазин" links={["Каталог", "Бестселлеры", "Новинки", "Бренды", "Акции"]} />
        <FooterCol title="Компания" links={["О нас", "Оптовикам", "Доставка", "Оплата", "Контакты"]} />
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

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest font-bold text-primary mb-4">{title}</div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
