import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
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
      "Кроватки, коляски, игрушки и одежда от лучших мировых брендов. Более 5 000 позиций с быстрой доставкой по России.",
    image: heroFamily,
    cta: "Открыть каталог",
    to: "/catalog" as const,
  },
  {
    tag: "Хит недели",
    title: "Коляски Nordic Cloud",
    accent: "лёгкость и стиль",
    subtitle:
      "Алюминиевая рама, амортизация нового поколения, складывается одной рукой. −18% до конца недели.",
    image: stroller,
    cta: "Смотреть коляски",
    to: "/catalog" as const,
  },
  {
    tag: "Montessori",
    title: "Развивающие игрушки",
    accent: "из натурального дерева",
    subtitle:
      "Безопасные материалы, ручная работа, сертифицированные пигменты. От первых месяцев до 6 лет.",
    image: stacker,
    cta: "К игрушкам",
    to: "/catalog" as const,
  },
  {
    tag: "Petit Ourson",
    title: "Мягкие друзья",
    accent: "с рождения",
    subtitle:
      "Плюшевые мишки ручной работы из органического хлопка. Гипоаллергенный наполнитель.",
    image: bear,
    cta: "Выбрать друга",
    to: "/catalog" as const,
  },
];

if (typeof window !== "undefined") {
  slides.forEach((s) => {
    const img = new Image();
    img.src = s.image;
  });
}

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-40 -right-40 size-[560px] rounded-full bg-sky/50 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[480px] rounded-full bg-blush/40 blur-[100px]" />

      {/* Fixed-height stage — never shifts between slides */}
      <div className="relative px-4 md:px-6 lg:px-10 pt-8 pb-14 md:pt-14 md:pb-24">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center min-h-[560px] md:min-h-[600px] lg:min-h-[620px]">
          {/* TEXT COLUMN */}
          <div className="order-2 lg:order-1 relative h-[420px] md:h-[460px] lg:h-[520px]">
            {slides.map((slide, idx) => (
              <motion.div
                key={idx}
                initial={false}
                animate={{ opacity: idx === i ? 1 : 0, y: idx === i ? 0 : 12 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col"
                style={{ pointerEvents: idx === i ? "auto" : "none" }}
              >
                <div className="inline-flex self-start items-center gap-2 rounded-full bg-background/75 backdrop-blur-md border border-border px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <Sparkles className="size-3.5" /> {slide.tag}
                </div>
                <h1 className="mt-6 text-[38px] leading-[1.02] md:text-6xl lg:text-[68px] font-extrabold text-primary tracking-tight">
                  {slide.title}
                  <span className="block font-serif italic font-medium text-primary-soft mt-2">
                    {slide.accent}
                  </span>
                </h1>
                <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-7 rounded-full bg-gradient-primary text-base font-semibold shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all"
                  >
                    <Link to={slide.to}>
                      {slide.cta} <ArrowRight className="ml-1 size-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-14 px-7 rounded-full bg-background/70 backdrop-blur-md text-base font-semibold border-border/80 hover:bg-background"
                  >
                    <a href="#bestsellers">Бестселлеры</a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* IMAGE COLUMN — clean, no floating stat cards */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full max-w-[560px] mx-auto aspect-square">
              <div className="absolute -inset-6 rounded-[52px] bg-gradient-to-br from-white/40 to-white/0 blur-2xl" />
              {slides.map((slide, idx) => (
                <motion.img
                  key={idx}
                  src={slide.image}
                  alt=""
                  initial={false}
                  animate={{ opacity: idx === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 size-full object-cover rounded-[42px] shadow-float border-[10px] border-background"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots + trust row — centered under everything, no jumping */}
        <div className="relative mx-auto max-w-7xl mt-10 md:mt-12 flex flex-col items-center gap-8">
          <div className="flex gap-2 items-center">
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

          <div className="grid grid-cols-3 gap-4 md:gap-10 w-full max-w-2xl">
            <Feature icon={Truck} label="Быстрая доставка" sub="по всей России" />
            <Feature icon={ShieldCheck} label="Оригинал 100%" sub="сертификаты" />
            <Feature icon={HeartHandshake} label="Забота о семье" sub="с 2015 года" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 justify-center md:justify-start">
      <div className="size-11 shrink-0 rounded-2xl bg-background/85 border border-border grid place-items-center text-primary shadow-sm">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-bold text-primary leading-tight truncate">{label}</div>
        <div className="text-[11px] text-muted-foreground truncate">{sub}</div>
      </div>
    </div>
  );
}
