import { useActiveSection } from '../hooks/useActiveSection';
import { ThemeToggle } from './ThemeToggle';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'blog', label: 'Blog' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function Nav() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-line"
      style={{
        background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 py-4 gap-4">
        <a href="#top" className="flex items-baseline gap-2 select-none shrink-0">
          <span className="text-[15px] font-medium tracking-tight">Abhijay&nbsp;S</span>
          <span className="text-[11px] text-fg-muted font-mono">/ portfolio</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`
                px-3 py-1.5 text-[13px] transition-colors relative
                ${active === s.id ? 'text-fg' : 'text-fg-muted hover:text-fg'}
              `}
            >
              {s.label}
              {active === s.id && (
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-px"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="mailto:abhijay@5cnetwork.com"
            className="group hidden sm:inline-flex items-center gap-2 border border-line hover:border-line-strong text-[12.5px] px-3.5 h-9 transition-colors"
          >
            <span>Get in touch</span>
            <span className="arrow-up-right">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
