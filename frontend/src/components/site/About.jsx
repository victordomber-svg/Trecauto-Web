import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Overline } from "./Reveal";

const FACTS = [
  ["01", "Recambios", "Piezas de desgaste y mantenimiento para turismos y vehículos de uso diario."],
  ["02", "Accesorios", "Todo lo que hace tu coche más cómodo, seguro y a tu gusto."],
  ["03", "Mostrador", "Atención cara a cara: traes la referencia o la pieza vieja y te orientamos."],
];

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="quienes" ref={ref} data-testid="about-section" className="py-24 md:py-40">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] clip-notch">
              <motion.img style={{ y }} src="/img/shelves.jpg" alt="Estanterías de recambios" className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover" />
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
          <Reveal><Overline n="01">La tienda</Overline></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display uppercase font-black text-5xl md:text-7xl leading-[0.9] tracking-tight">
              Tu tienda de recambios <span className="text-[var(--amber)]">de barrio</span>, en el corazón de Jerez.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-base md:text-lg text-[var(--bone)]/75 leading-relaxed max-w-2xl">
              Trecauto es una tienda especializada en <strong className="text-[var(--bone)]">accesorios y recambios para el automóvil</strong>,
              situada en el Paseo de las Delicias, 50. Un sitio donde te atiende alguien que sabe de coches,
              te escucha y te da la pieza correcta a la primera. Sin vueltas y sin perder la mañana.
            </p>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {FACTS.map(([n, t, d], i) => (
              <Reveal key={n} delay={0.1 * i} className="bg-[#0A0D12] p-6" >
                <div data-testid={`about-fact-${n}`}>
                  <div className="font-mono text-xs text-[var(--amber)]">{n}</div>
                  <div className="mt-3 font-display text-2xl uppercase font-bold">{t}</div>
                  <p className="mt-2 text-sm text-[var(--bone)]/70 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
