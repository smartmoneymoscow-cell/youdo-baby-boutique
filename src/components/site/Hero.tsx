import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import heroFamily from "@/assets/hero-family.jpg";
import stroller from "@/assets/product-stroller.jpg";
import bear from "@/assets/product-bear.jpg";
import stacker from "@/assets/product-stacker.jpg";
import { Button } from "@/components/ui/button";

const slides = [
  {
    tag: "Новая коллекция",
    title: "Премиум-товары",
    accent: "для счастливого детства",
    subtitle:
      "Кроватки, коляски, игрушки и одежда от лучших мировых брендов. Оптовые цены для магазинов и садиков.",
    image: heroFamily,
    cta: "Открыть каталог",
    href: "#catalog",
  },
  {
    tag: "Хит недели",
    title: "Коляски Nordic Cloud",
    accent: "лёгкость и стиль",
    subtitle:
      "Алюминиевая рама, амортизация нового поколения, складывается одной рукой. −18% до конца недели.",
    image: stroller,
    cta: "Смотреть коляски",
    href: "#catalog",
  },
  {
    tag: "Montessori",
    title: "Развивающие игрушки",
    accent: "из натурального дерева",
    subtitle:
      "Безопасные материалы, ручная работа, сертифицированные пигменты. От первых месяцев до 6 лет.",
    image: stacker,
    cta: "К игрушкам",
    href: "#catalog",
  },
  {
    tag: "Petit Ourson",
    title: "Мягкие друзья",
    accent: "с рождения",
    subtitle:
      "Плюшевые мишки ручной работы из органического хлопка. Гипоаллергенный наполнитель.",
    image: bear,
    cta: "Выбрать друга",
    href: "#catalog",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute -top-32 -right-24 size-[520px] rounded-full bg-accent/60 blur-3xl opacity-70" />
      <div className="absolute -bottom-40 -left-24 size-[420px] rounded-full bg-cream blur-3xl opacity-70" />

      <div className="relative px-4 md:px-6 lg:px-10 pt-6 pb-14 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur-md border border-border px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <Sparkles className="size-3.5" /> {s.tag}
                </div>
                <h1 className="mt-5 text-[36px] leading-[1.05] md:text-6xl lg:text-7xl font-extrabold text-primary tracking-tight">
                  {s.title}
                  <span className="block font-serif italic font-medium text-primary-soft mt-1">
                    {s.accent}
                  </span>
                </h1>
                <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {s.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-14 px-7 rounded-full bg-gradient-primary text-base font-semibold shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all"
              >
                <a href={s.href}>{s.cta} <ArrowRight className="ml-1 size-5" /></a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-7 rounded-full bg-background/60 backdrop-blur-md text-base font-semibold border-border/80 hover:bg-background"
              >
                <a href="#wholesale">Оптовые цены</a>
              </Button>
            </div>

            <div className="mt-10 flex gap-2 items-center">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Слайд ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-10 bg-primary" : "w-4 bg-primary/25 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 md:gap-5 max-w-md">
              <Feature icon={Truck} label="Быстрая доставка" />
              <Feature icon={ShieldCheck} label="Оригинал 100%" />
              <Feature icon={HeartHandshake} label="Забота о семье" />
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] md:aspect-square max-w-[560px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={i}
                  src={s.image}
                  initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 size-full object-cover rounded-[42px] shadow-float border-8 border-background"
                />
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -left-3 md:-left-8 top-8 md:top-16 bg-background/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-card border border-border animate-float"
              >
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Каталог</div>
                <div className="text-xl md:text-2xl font-extrabold text-primary">5 000+ SKU</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -right-2 md:-right-6 bottom-6 md:bottom-10 bg-background/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-card border border-border flex items-center gap-3"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex -space-x-2">
                  {["#f3d9b1", "#c9dcef", "#e8ccc2"].map((c) => (
                    <span key={c} className="size-8 rounded-full border-2 border-background" style={{ background: c }} />
                  ))}
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Довольных семей</div>
                  <div className="text-sm font-bold text-primary">12 400+</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="size-10 rounded-xl bg-background/80 border border-border grid place-items-center text-primary shadow-sm">
        <Icon className="size-5" />
      </div>
      <div className="text-xs font-medium text-foreground/80 leading-tight">{label}</div>
    </div>
  );
}
