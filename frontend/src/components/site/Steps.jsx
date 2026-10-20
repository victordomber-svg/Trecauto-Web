import { Car, Search, PhoneCall, Store } from "lucide-react";
import { Reveal, Overline } from "./Reveal";

const STEPS = [
  [Car, "Dinos tu coche", "Marca, modelo y año. Si tienes la matrícula o el bastidor a mano, mejor aún."],
  [Search, "Cuéntanos la pieza", "Lo que necesitas o el síntoma que notas. También vale una foto de la pieza vieja."],
  [PhoneCall, "Te llamamos", "Confirmamos disponibilidad y precio contigo, sin compromiso."],
  [Store, "Pasa a recogerla", "Vienes al Paseo de las Delicias, 50 y la tienes preparada."],
];

export const Steps = () => (
  <section id="como" data-testid="steps-section" className="py-24 md:py-36">
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <Reveal><Overline n="03">Cómo funciona</Overline></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-6 font-display uppercase font-black text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-4xl">
          Llega y llévatela. <span className="text-[var(--amber)]">Así de simple.</span>
        </h2>
      </Reveal>
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
        {STEPS.map(([Icon, t, d], i) => (
          <Reveal key={t} delay={i * 0.1} className="group border-b lg:border-b-0 lg:border-r last:border-r-0 border-white/10 py-10 lg:px-8 first:lg:pl-0">
            <div data-testid={`step-${i + 1}`}>
              <div className="flex items-center justify-between">
                <span className="font-display text-7xl font-black text-outline group-hover:text-[var(--amber)] transition-colors duration-500">0{i + 1}</span>
                <Icon className="w-7 h-7 text-[var(--amber)] transition-transform duration-500 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-8 font-display uppercase text-3xl font-bold">{t}</h3>
              <p className="mt-3 text-[var(--bone)]/70 leading-relaxed">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);