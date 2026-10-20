import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Send, Phone, CheckCircle2 } from "lucide-react";
import { Reveal, Overline } from "./Reveal";
import { BIZ } from "../../lib/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMPTY = { name: "", phone: "", email: "", model: "", year: "", part: "", message: "" };

const Field = ({ label, id, testId, area, ...p }) => (
  <label className="block group">
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--bone)]/70 group-focus-within:text-[var(--amber)] transition-colors">{label}</span>
    {area ? (
      <textarea data-testid={testId} id={id} rows={3} {...p} className="field resize-none" />
    ) : (
      <input data-testid={testId} id={id} {...p} className="field" />
    )}
  </label>  
);

export const RequestForm = () => {
  const [f, setF] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/part-requests`, { ...f, email: f.email.trim() || null });;
      setDone(true);
      setF(EMPTY);
      toast.success("¡Consulta enviada! Te llamaremos lo antes posible.");
    } catch {
      toast.error(`No se pudo enviar. Llámanos al ${BIZ.phone}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pedir" data-testid="request-section" className="py-24 md:py-36 bg-[var(--bone)] text-[#0A0D12]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <Reveal><div className="font-mono text-xs uppercase tracking-[0.25em] text-[#B4520A] flex items-center gap-3"><span className="text-[#0A0D12]/60">04</span><span className="h-px w-8 bg-[#B4520A]" />Consulta tu pieza</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display uppercase font-black text-5xl md:text-7xl leading-[0.9] tracking-tight">
              Pregunta antes. <br />Ven a tiro hecho.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg text-[#0A0D12]/75 leading-relaxed max-w-md">
              Rellena el formulario y te confirmamos por teléfono si tenemos la pieza y su precio. Sin compromiso.
            </p>
            <a href={BIZ.tel} data-testid="form-call-btn" className="mt-10 inline-flex items-center gap-3 font-display text-4xl md:text-5xl font-black uppercase hover:text-[#B4520A] transition-colors">
              <Phone className="w-8 h-8" /> {BIZ.phone}
            </a>
            <p className="mt-2 text-sm text-[#0A0D12]/65">¿Prefieres hablar? Llama directamente.</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-7">
          {done ? (
            <div data-testid="request-success" className="rounded-[28px] bg-[#0A0D12] text-[var(--bone)] p-10 md:p-14 min-h-[420px] flex flex-col justify-center">
              <CheckCircle2 className="w-14 h-14 text-[var(--amber)]" />
              <h3 className="mt-6 font-display uppercase text-5xl font-black">Recibido.</h3>
              <p className="mt-4 text-[var(--bone)]/75 max-w-md">Hemos recibido tu consulta y ya está en manos del equipo de la tienda. Te llamaremos para confirmarte disponibilidad y precio.</p>
              <button data-testid="request-new-btn" onClick={() => setDone(false)} className="mt-8 self-start rounded-full border border-white/25 px-6 py-3 hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors">Hacer otra consulta</button>
            </div>
          ) : (
            <form data-testid="part-request-form" onSubmit={submit} className="rounded-[28px] bg-white p-7 md:p-12 shadow-[0_40px_80px_-40px_rgba(10,13,18,0.35)] grid sm:grid-cols-2 gap-x-8 gap-y-7">
              <Field label="Nombre *" testId="input-client-name" required minLength={2} value={f.name} onChange={set("name")} placeholder="Tu nombre" />
              <Field label="Teléfono *" testId="input-client-phone" type="tel" required minLength={6} value={f.phone} onChange={set("phone")} placeholder="600 000 000" />
              <div className="sm:col-span-2"><Field label="Email (opcional, te enviamos confirmación)" testId="input-client-email" type="email" value={f.email} onChange={set("email")} placeholder="tu@email.com" /></div>
              <Field label="Marca *" testId="input-vehicle-make" required value={f.make} onChange={set("make")} placeholder="Ej. Seat" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Modelo" testId="input-vehicle-model" value={f.model} onChange={set("model")} placeholder="León" />
                <Field label="Año" testId="input-vehicle-year" inputMode="numeric" maxLength={4} value={f.year} onChange={set("year")} placeholder="2016" />
              </div>
              <div className="sm:col-span-2"><Field label="Pieza que necesitas *" testId="input-part-needed" required minLength={2} value={f.part} onChange={set("part")} placeholder="Ej. pastillas de freno delanteras" /></div>
              <div className="sm:col-span-2"><Field label="Comentarios" testId="input-message" area value={f.message} onChange={set("message")} placeholder="Matrícula, bastidor, síntomas…" /></div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[#0A0D12]/60 max-w-xs">Usaremos tus datos solo para responder a esta consulta.</p>
                <button type="submit" disabled={loading} data-testid="btn-submit-part-request"
                  className="group inline-flex justify-center items-center gap-3 rounded-full bg-[#0A0D12] text-[var(--bone)] px-8 py-4 font-semibold hover:bg-[#B4520A] transition-colors disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                  Enviar consulta
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
};

