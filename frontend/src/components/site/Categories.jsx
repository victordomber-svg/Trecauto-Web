import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Overline } from "./Reveal";
import { scrollToId } from "../../lib/site";

const CATS = [
  { id: "frenos", t: "Frenos", d: "Pastillas, discos, zapatas y líquido de frenos.", img: "/img/brakes.jpg", cls: "md:col-span-4 md:row-span-2" },
  { id: "motor", t: "Motor y filtros", d: "Filtros de aceite, aire, habitáculo y combustible. Correas y bujías.", img: "/img/engine.jpg", cls: "md:col-span-2" },
  { id: "aceites", t: "Aceites y líquidos", d: "Lubricantes, anticongelante y limpiaparabrisas.", img: "/img/oil.jpg", cls: "md:col-span-2" },
  { id: "suspension", t: "Suspensión", d: "Amortiguadores, rótulas y silentblocks.", img: "/img/caliper.jpg", cls: "md:col-span-2" },
  { id: "electricidad", t: "Baterías e iluminación", d: "Baterías, lámparas y fusibles.", img: "/img/chrome.jpg", cls: "md:col-span-2" },
  { id: "accesorios", t: "Accesorios", d: "Escobillas, alfombrillas, cuidado y estética del coche.", img: "/img/rims.jpg", cls: "md:col-span-2" },
];

const Card = ({ c, i }) => (
  <motion.button
    data-testid={`category-card-${c.id}`}
    onClick={() => scrollToId("pedir")}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className={`group relative overflow-hidden rounded-[22px] text-left min-h-[260px] border border-white/10 hover:border-[var(--amber)]/60 transition-colors ${c.cls}`}
  >
    <img src={c.img} alt={c.t} className="absolute inset-0 w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-[transform,filter] duration-[1200ms]" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/55 to-[#0A0D12]/10" />
    <div className="relative h-full flex flex-col justify-between p-6 md:p-7">
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-[var(--bone)]/80">0{i + 1}</span>
        <span className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-[var(--amber)] group-hover:text-[#0A0D12] group-hover:border-[var(--amber)] transition-colors">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
      <div>
        <h3 className="font-display uppercase font-extrabold text-3xl md:text-4xl leading-none">{c.t}</h3>
        <p className="mt-2 text-sm text-[var(--bone)]/80 max-w-xs">{c.d}</p>
      </div>
    </div>
  </motion.button>
);

export const Categories = () => (
  <section id="recambios" data-testid="categories-section" className="py-24 md:py-36 bg-[#0D1118]">
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div>
          <Reveal><Overline n="02">Qué encontrarás</Overline></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display uppercase font-black text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-3xl">
              Del filtro al faro. <span className="text-outline">Todo bajo un techo.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-sm text-[var(--bone)]/70">¿No ves lo que buscas? Pregúntanos: si no lo tenemos en tienda, te decimos cómo conseguirlo.</p>
        </Reveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 md:auto-rows-[280px] gap-4">
        {CATS.map((c, i) => <Card key={c.id} c={c} i={i} />)}
      </div>
    </div>
  </section>
);