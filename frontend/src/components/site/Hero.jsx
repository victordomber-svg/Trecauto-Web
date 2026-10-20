import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDownRight, MapPin, Phone } from "lucide-react";
import { BIZ, EASE, scrollToId } from "../../lib/site";

const LINES = ["La pieza", "que tu coche", "necesita."];

const Line = ({ text, i, accent }) => (
  <span className="block overflow-hidden pb-[0.06em]">
    <motion.span
      className={`block ${accent ? "text-[var(--amber)] italic" : ""}`}
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.1, delay: 0.25 + i * 0.14, ease: EASE }}
    >
      {text}
    </motion.span>
  </span>
);

const TiltFrame = ({ y }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div style={{ y }} className="relative [perspective:1200px]" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] spotlight"
        data-testid="hero-image-frame"
      >
        <motion.img
          src="/img/hero.jpg" alt="Disco de freno en primer plano"
          initial={{ scale: 1.3 }} animate={{ scale: 1.05 }} transition={{ duration: 2.2, delay: 0.5, ease: EASE }}
          className="ring-spin absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--bone)]">
          <span>Ref. 180320</span>
          <span>{BIZ.lat}° N / {Math.abs(BIZ.lng)}° W</span>
        </div>
      </motion.div>
      <div className="absolute -left-6 -top-6 hidden md:flex z-10 w-28 h-28 rounded-full bg-[var(--amber)] text-[#0A0D12] items-center justify-center rotate-badge">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs><path id="c" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs>
          <text className="font-mono" fontSize="9.5" letterSpacing="1.6" fill="#0A0D12"><textPath href="#c">RECAMBIOS · JEREZ · TRECAUTO ·</textPath></text>
        </svg>
        <ArrowDownRight className="w-7 h-7" />
      </div>
    </motion.div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="inicio" ref={ref} data-testid="hero-section" className="relative min-h-[100svh] pt-28 md:pt-32 pb-16 overflow-hidden grain">
      <div className="absolute inset-0 grid-lines pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-12 lg:gap-10 items-end">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--amber)] mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse" /> Recambios y accesorios del automóvil · Jerez
          </motion.div>
          <h1 data-testid="hero-title" className="font-display uppercase font-black leading-[0.86] tracking-[-0.02em] text-[15vw] sm:text-7xl lg:text-[8.2rem]">
            {LINES.map((l, i) => <Line key={l} text={l} i={i} accent={i === 2} />)}
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            className="mt-8 max-w-xl text-base md:text-lg text-[var(--bone)]/75 leading-relaxed">
            En Trecauto encuentras recambios y accesorios para tu coche en pleno Paseo de las Delicias.
            Dinos marca, modelo y lo que buscas: te lo dejamos preparado antes de que vengas.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3">
            <button data-testid="hero-request-btn" onClick={() => scrollToId("pedir")}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--amber)] text-[#0A0D12] pl-6 pr-2 py-2 font-semibold hover:bg-[var(--bone)] transition-colors">
              Consultar una pieza
              <span className="w-10 h-10 rounded-full bg-[#0A0D12] text-[var(--amber)] flex items-center justify-center transition-transform group-hover:rotate-[-45deg]"><ArrowDownRight className="w-5 h-5" /></span>
            </button>
            <a href={BIZ.tel} data-testid="hero-call-btn" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 font-semibold hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors">
              <Phone className="w-4 h-4" /> {BIZ.phone}
            </a>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} onClick={() => scrollToId("ubicacion")} data-testid="hero-address-link"
            className="mt-10 flex items-center gap-2 text-sm text-[var(--bone)]/70 hover:text-[var(--amber)] transition-colors">
            <MapPin className="w-4 h-4" /> {BIZ.street} · {BIZ.city}
          </motion.button>
        </motion.div>
        <div className="lg:col-span-5"><TiltFrame y={imgY} /></div>
      </div>
    </section>
  );
};
