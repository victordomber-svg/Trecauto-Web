const WORDS = ["Frenos", "Filtros", "Aceites", "Baterías", "Iluminación", "Suspensión", "Accesorios", "Paseo de las Delicias"];

const Row = () => (
  <div className="flex shrink-0 items-center">
    {WORDS.map((w) => (
      <span key={w} className="flex items-center font-display uppercase font-extrabold text-5xl md:text-8xl tracking-tight px-6 md:px-10">
        <span className="text-outline">{w}</span>
        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-10 md:h-10 ml-12 md:ml-20 text-[var(--amber)]" fill="currentColor"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="marquee" className="py-10 md:py-14 border-y border-white/10 overflow-hidden bg-[#0A0D12]">
    <div className="flex w-max marquee-track">
      <Row /><Row />
    </div>
  </section>
);
