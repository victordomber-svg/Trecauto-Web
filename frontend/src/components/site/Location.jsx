import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Reveal, Overline } from "./Reveal";
import { BIZ, MAP_EMBED, MAP_DIRECTIONS } from "../../lib/site";

const Row = ({ icon: Icon, label, children, testId }) => (
  <div data-testid={testId} className="flex gap-5 py-6 border-b border-white/10">
    <Icon className="w-5 h-5 mt-1 text-[var(--amber)] shrink-0" />
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--bone)]/60">{label}</div>
      <div className="mt-1 text-lg">{children}</div>
    </div>
  </div>
);

export const Location = () => (
  <section id="ubicacion" data-testid="location-section" className="py-24 md:py-36">
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <Reveal><Overline n="05">Dónde estamos</Overline></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-6 font-display uppercase font-black text-5xl md:text-8xl leading-[0.88] tracking-tight">
          Paseo de las <span className="text-[var(--amber)]">Delicias, 50.</span>
        </h2>
      </Reveal>
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-7">
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[340px]">
            <iframe data-testid="google-map-embed" title="Mapa Trecauto" src={MAP_EMBED} loading="lazy"
              className="absolute inset-0 w-full h-full map-dark" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-5">
          <Row icon={MapPin} label="Dirección" testId="location-address">{BIZ.street}<br />{BIZ.city} (Cádiz)</Row>
          <Row icon={Phone} label="Teléfono" testId="location-phone"><a href={BIZ.tel} className="hover:text-[var(--amber)] transition-colors">{BIZ.phone}</a></Row>
          <Row icon={Clock} label="Horario" testId="location-hours">{BIZ.hours}</Row>
          <Row icon={Navigation} label="GPS" testId="location-gps"><span className="font-mono text-base">{BIZ.lat}, {BIZ.lng}</span></Row>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer" data-testid="btn-directions"
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-full bg-[var(--amber)] text-[#0A0D12] px-6 py-4 font-semibold hover:bg-[var(--bone)] transition-colors">
              <Navigation className="w-4 h-4" /> Cómo llegar
            </a>
            <a href={BIZ.tel} data-testid="btn-call-now"
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-full border border-white/20 px-6 py-4 font-semibold hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors">
              <Phone className="w-4 h-4" /> Llamar ahora
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);