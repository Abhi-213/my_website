export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-12 md:py-16">

        {/* Big mark */}
        <div className="flex items-baseline justify-between flex-wrap gap-6 mb-12">
          <div className="font-medium text-[40px] md:text-[64px] tracking-tightest leading-[0.9]">
            Abhijay&nbsp;S<span className="text-accent">.</span>
          </div>
          <a
            href="mailto:abhijay@5cnetwork.com"
            className="group inline-flex items-center gap-2 border border-line hover:border-line-strong px-4 py-2 text-[12.5px] transition-colors"
          >
            <span>Back to top</span>
            <span className="arrow-up-right">↑</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-8 pb-12 border-b border-line">
          <FooterCol label="Sections" items={[
            { href: '#about', label: 'About' },
            { href: '#work', label: 'Work' },
            { href: '#experience', label: 'Experience' },
            { href: '#stack', label: 'Stack' },
            { href: '#contact', label: 'Contact' },
          ]} />
          <FooterCol label="Direct" items={[
            { href: 'mailto:abhijay@5cnetwork.com', label: 'Email' },
            { href: 'https://www.linkedin.com/in/abhijay-s-58b5ba293/', label: 'LinkedIn', external: true },
          ]} />
          <FooterCol label="Based in" items={[
            { label: 'Bengaluru, India' },
            { label: '5C Network Pvt Ltd' },
          ]} />
          <FooterCol label="Status" items={[
            { label: 'Open to ML / AI roles' },
            { label: 'Last updated · May 2026' },
          ]} />
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[10.5px] tracking-[0.18em] uppercase text-fg-muted">
          <span>© {new Date().getFullYear()} Abhijay S</span>
          <span>Bengaluru, India</span>
        </div>

      </div>
    </footer>
  );
}

function FooterCol({
  label,
  items,
}: {
  label: string;
  items: { label: string; href?: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="eyebrow mb-4">{label}</div>
      <ul className="space-y-2 text-[13px]">
        {items.map((it, i) => (
          <li key={i}>
            {it.href ? (
              <a
                href={it.href}
                {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex items-center gap-1.5 text-fg-dim hover:text-fg transition-colors"
              >
                <span>{it.label}</span>
                {it.external && <span className="arrow-up-right text-fg-muted">↗</span>}
              </a>
            ) : (
              <span className="text-fg-dim">{it.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
