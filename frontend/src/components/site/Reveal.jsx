import { motion } from "framer-motion";
import { EASE } from "../../lib/site";

export const Reveal = ({ children, delay = 0, y = 40, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const Overline = ({ children, n }) => (
  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--amber)]">
    {n && <span className="text-[var(--muted)]">{n}</span>}
    <span className="h-px w-8 bg-[var(--amber)]" />
    {children}
  </div>
);