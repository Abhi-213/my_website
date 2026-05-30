import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy-load the 3D scene so the page paints fast
const HeroScene = lazy(() =>
  import('./HeroScene').then((m) => ({ default: m.HeroScene }))
);

export function Hero() {
  return (
    <section id="top" className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      {/* 3D scene — full-bleed background, hero name overlaid */}
      <div className="absolute inset-0 opacity-90 pointer-events-none">
        <Suspense fallback={<div className="absolute inset-0 ambient" />}>
          <HeroScene />
        </Suspense>
        {/* Top + bottom fade to bg so the content reads */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-bg/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          <span className="eyebrow">Data Scientist · 5C Network · Bengaluru</span>
        </motion.div>

        {/* The huge name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-medium tracking-ultra leading-[0.86] text-balance"
          style={{ fontSize: 'clamp(72px, 16vw, 240px)' }}
        >
          <span className="block">Abhijay&nbsp;S<span className="text-accent">.</span></span>
        </motion.h1>

        {/* Role tagline below */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 md:mt-14 max-w-[42ch]"
        >
          <div className="text-[20px] md:text-[28px] font-medium tracking-tight leading-[1.2] text-fg">
            Data Scientist building <span className="text-accent">vision</span> and <span className="text-accent">LLM</span> systems for radiology.
          </div>
        </motion.div>

        {/* Sub-paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 md:mt-8 max-w-[62ch] text-[15px] md:text-[17px] leading-[1.65] text-fg-dim text-balance"
        >
          At 5C Network in Bengaluru. Behind the orchestration that automates{' '}
          <span className="text-fg font-medium">~60% of incoming chest X-ray reads</span>,
          plus a handful of LLM tools radiologists use daily.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 bg-fg text-bg px-5 py-3 text-[13.5px] font-medium hover:bg-accent transition-colors"
          >
            <span>Selected work</span>
            <span className="arrow-up-right">↓</span>
          </a>
          <a
            href="mailto:abhijay@5cnetwork.com"
            className="group inline-flex items-center gap-2 border border-line hover:border-line-strong px-5 py-3 text-[13.5px] transition-colors backdrop-blur-sm bg-bg/30"
          >
            <span>abhijay@5cnetwork.com</span>
            <span className="arrow-up-right text-fg-muted">↗</span>
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute right-6 md:right-10 bottom-2 hidden md:flex items-center gap-2 font-mono text-[11px] text-fg-muted"
        >
          <span className="uppercase tracking-[0.22em]">scroll</span>
          <span className="block h-px w-12 bg-line-strong" />
        </motion.div>
      </div>
    </section>
  );
}
