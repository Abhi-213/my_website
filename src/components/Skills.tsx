import { motion } from 'framer-motion';
import { skillGroups } from '../data/content';

export function Skills() {
  return (
    <section id="stack" className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-28">

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">Stack</span>
            <h2 className="h-section mt-8 text-balance">
              What I reach for, <span className="text-fg-muted">day to day.</span>
            </h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="border-t border-line"
        >
          {skillGroups.map((group, i) => (
            <div
              key={group.label}
              className="grid grid-cols-12 gap-x-8 gap-y-4 py-8 md:py-10 border-b border-line"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="num-badge mb-2">— {String(i + 1).padStart(2, '0')}</div>
                <div className="text-[14.5px] font-medium text-fg">{group.label}</div>
              </div>
              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <ul className="flex flex-wrap gap-x-2 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line text-fg-dim px-3 py-1 text-[12px] hover:border-line-strong hover:text-fg transition-colors cursor-default"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
