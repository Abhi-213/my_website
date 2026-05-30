import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'amber' ? 'violet' : 'amber';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="group relative inline-flex items-center gap-2 h-9 px-3 border border-line hover:border-line-strong transition-colors text-[12px]"
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              theme === 'amber'
                ? 'linear-gradient(135deg, #fbbf24, #fb923c)'
                : 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2), 0 0 12px rgba(var(--accent-rgb), 0.5)',
          }}
        />
      </span>
      <span className="text-fg-muted group-hover:text-fg transition-colors font-mono">
        {theme}
      </span>
    </button>
  );
}
