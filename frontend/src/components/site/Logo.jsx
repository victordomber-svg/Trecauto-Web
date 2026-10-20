export const LogoMark = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="22" fill="none" stroke="var(--amber)" strokeWidth="5" />
    <g fill="var(--amber)">
      <circle cx="32" cy="14" r="2.4" /><circle cx="47.6" cy="23" r="2.4" /><circle cx="47.6" cy="41" r="2.4" />
      <circle cx="32" cy="50" r="2.4" /><circle cx="16.4" cy="41" r="2.4" /><circle cx="16.4" cy="23" r="2.4" />
    </g>
    <path d="M21 22h22v6h-8v16h-6V28h-8z" fill="var(--bone)" />
  </svg>
);

export const Logo = ({ testId = "brand-logo" }) => (
  <a href="#inicio" data-testid={testId} className="flex items-center gap-2.5 group">
    <LogoMark className="w-9 h-9 transition-transform duration-700 group-hover:rotate-[120deg]" />
    <span className="font-display text-2xl font-extrabold uppercase tracking-tight leading-none">
      Trec<span className="text-[var(--amber)]">auto</span>
    </span>
  </a>
);
