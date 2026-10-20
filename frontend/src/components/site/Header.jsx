import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { BIZ, scrollToId } from "../../lib/site";

const LINKS = [
  ["quienes", "La tienda"],
  ["recambios", "Recambios"],
  ["como", "Cómo funciona"],
  ["pedir", "Pedir pieza"],
  ["ubicacion", "Dónde estamos"],
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-500 border-b ${
        scrolled || open ? "bg-[#0A0D12]/80 backdrop-blur-xl border-white/10" : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[72px] flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-link-${id}`} onClick={() => go(id)}
              className="nav-link text-sm text-[var(--bone)]/80 hover:text-[var(--bone)] transition-colors">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={BIZ.tel} data-testid="header-call-btn"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--amber)] text-[#0A0D12] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--bone)] transition-colors">
            <Phone className="w-4 h-4" /> {BIZ.phone}
          </a>
          <button data-testid="mobile-menu-toggle" onClick={() => setOpen(!open)} className="lg:hidden p-2 text-[var(--bone)]" aria-label="Menú">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden px-5 pb-8 pt-2 flex flex-col gap-1">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`mobile-nav-${id}`} onClick={() => go(id)}
              className="text-left font-display text-3xl uppercase font-bold py-2 border-b border-white/10">
              {label}
            </button>
          ))}
          <a href={BIZ.tel} data-testid="mobile-call-btn" className="mt-4 inline-flex justify-center items-center gap-2 rounded-full bg-[var(--amber)] text-[#0A0D12] py-3 font-semibold">
            <Phone className="w-4 h-4" /> Llamar {BIZ.phone}
          </a>
        </div>
      )}
    </header>
  );
};
