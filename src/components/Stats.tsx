import { motion } from 'framer-motion';
import { stats } from '../data/content';

export function Stats() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-16 md:py-20">
        <div className="flex items-center gap-3 mb-10">
          <span className="eyebrow">By the numbers</span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10.5px] text-fg-muted">2025 — present</span>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-[44px] md:text-[64px] font-medium tracking-tightest leading-[0.95] text-fg">
                {s.value}
              </dt>
              <dd className="mt-3 text-[12.5px] leading-relaxed text-fg-dim max-w-[20ch]">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
