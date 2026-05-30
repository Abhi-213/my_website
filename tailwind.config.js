/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Actual colors are CSS variables — see src/index.css.
      // We keep a few Tailwind tokens so utility classes still work.
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          dim: 'var(--fg-dim)',
          muted: 'var(--fg-muted)',
          faint: 'var(--fg-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        ultra: '-0.05em',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.21, 0.47, 0.32, 0.98) forwards',
        marquee: 'marquee 50s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
