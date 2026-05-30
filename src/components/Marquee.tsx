import { marqueeTools } from '../data/content';

export function Marquee() {
  // Duplicate the list so the seamless loop works
  const items = [...marqueeTools, ...marqueeTools];

  return (
    <section
      aria-hidden
      className="relative border-t border-b border-line overflow-hidden bg-bg-alt"
      style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div className="py-6">
        <div className="marquee-track">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-mono text-[13px] text-fg-muted hover:text-accent transition-colors flex items-center gap-3"
            >
              <span className="h-1 w-1 rounded-full bg-fg-faint" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
