const brands = [
  "Chicco", "Pampers", "Nuk", "Avent", "Fisher-Price",
  "LEGO DUPLO", "Huggies", "Mothercare", "Nestlé", "Britax",
  "Maxi-Cosi", "Peg-Pérego", "Stokke", "Hape", "Bugaboo",
  "Little Tikes", "Munchkin", "Tommee Tippee", "Bébé Confort", "Silver Cross",
];

export function BrandsMarquee() {
  const items = [...brands, ...brands];
  return (
    <section className="relative py-14 md:py-20 bg-gradient-soft border-y border-border/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 mb-8 md:mb-10 text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-primary-soft font-semibold">Наши партнёры</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          Более <span className="italic font-serif font-medium text-primary-soft">200 мировых</span> детских брендов
        </h2>
      </div>

      <div className="relative">
        {/* fades on both sides */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[color:var(--background)] via-[color:var(--background)]/70 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[color:var(--background)] via-[color:var(--background)]/70 to-transparent z-10" />

        <div className="flex w-max animate-brands-marquee gap-4 md:gap-6">
          {items.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="shrink-0 h-16 md:h-20 min-w-[180px] md:min-w-[220px] px-8 rounded-2xl bg-background border border-border/70 shadow-sm flex items-center justify-center"
            >
              <span className="font-serif italic text-xl md:text-2xl font-medium text-primary/90 tracking-tight whitespace-nowrap">
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
