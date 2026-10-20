import { Phone } from "lucide-react";
import { Logo } from "./logo";
import { BIZ } from "../../lib/site";

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-white/10 pt-20 pb-28 md:pb-10 overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <Logo testId="footer-logo" />
          <p className="mt-4 text-sm text-[var(--bone)]/70 max-w-xs">Recambios y accesorios para el automóvil en Jerez de la Frontera.</p>
        </div>
        <div className="text-sm text-[var(--bone)]/75 leading-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)] mb-3">Visítanos</div>
          {BIZ.street}<br />{BIZ.city} (Cádiz)<br />{BIZ.hours}
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)] mb-3">Llámanos</div>
          <a href={BIZ.tel} data-testid="footer-call-btn" className="font-display text-4xl font-black hover:text-[var(--amber)] transition-colors">{BIZ.phone}</a>
        </div>
      </div>
      <div className="mt-20 font-display uppercase font-black leading-[0.8] tracking-tighter text-[24vw] md:text-[22.5vw] text-outline select-none" aria-hidden="true">Trecauto</div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--bone)]/60">
        <span>© {new Date().getFullYear()} Trecauto · Recambios para el automóvil</span>
        <span>Aviso legal · Privacidad · Cookies</span>
      </div>
    </div>
  </footer>
);

export const FloatingCall = () => (
  <a href={BIZ.tel} data-testid="floating-call-btn" aria-label="Llamar a Trecauto"
    className="md:hidden fixed bottom-4 inset-x-4 z-40 flex items-center justify-center gap-2 rounded-full bg-[var(--amber)] text-[#0A0D12] py-4 font-semibold shadow-[0_20px_40px_-10px_rgba(255,138,31,0.5)]">
    <Phone className="w-4 h-4" /> Llamar · {BIZ.phone}
  </a>
);