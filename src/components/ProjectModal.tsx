import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Project } from '../data/content';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-bg"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="min-h-full"
          >
            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur-md">
              <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 md:px-10 py-4">
                <div className="flex items-baseline gap-3 truncate">
                  <span className="num-badge">— {project.number}</span>
                  <span className="text-[13px] text-fg truncate">{project.title}</span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="group inline-flex items-center gap-2 border border-line hover:border-line-strong px-3.5 py-1.5 text-[12px] transition-colors"
                >
                  <X size={13} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Hero */}
            <div className="border-b border-line">
              <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-24">
                <div className="flex items-center gap-4 mb-10">
                  <span className="num-badge">— {project.number}</span>
                  <span className="cat-chip">{project.domain}</span>
                </div>

                <h1 className="font-medium tracking-ultra text-[40px] md:text-[88px] leading-[0.92] text-balance text-fg max-w-[20ch]">
                  {project.title}
                </h1>

                <p className="mt-8 max-w-[60ch] text-[16px] md:text-[18px] leading-[1.55] text-fg-dim text-balance">
                  {project.subtitle}
                </p>

                {/* Meta rows */}
                <dl className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 border-t border-line pt-8">
                  <MetaRow label="Status" value={project.status} />
                  <MetaRow label="Domain" value={project.domain} />
                  {project.metric && <MetaRow label="Outcome" value={project.metric} />}
                </dl>

                <div className="mt-8">
                  <span className="eyebrow">Stack</span>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-line text-fg-dim px-3 py-1 text-[12px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
              <div className="grid grid-cols-12 gap-x-8 gap-y-10">
                <div className="col-span-12 md:col-span-3">
                  <span className="eyebrow">Case study</span>
                </div>

                <div className="col-span-12 md:col-span-8 md:col-start-5 max-w-[68ch]">
                  {project.blog && project.blog.length > 0 ? (
                    <div className="space-y-6 text-[16px] md:text-[17px] leading-[1.75] text-fg-dim justify-prose">
                      {project.blog.map((p, i) => (
                        <p key={i} className={i === 0 ? 'text-fg text-[18px] md:text-[20px] leading-[1.6]' : ''}>
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5 text-[16px] leading-[1.75] text-fg-dim justify-prose">
                      {project.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                      <p className="text-[13px] text-fg-muted font-mono pt-4 text-left">
                        — full case study coming soon
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close at bottom */}
              <div className="mt-24 pt-8 border-t border-line flex items-center justify-between">
                <span className="num-badge">— end of {project.number}</span>
                <button
                  onClick={onClose}
                  className="group inline-flex items-center gap-2 text-[13px] text-fg-dim hover:text-fg transition-colors"
                >
                  <span>Back to all work</span>
                  <span className="arrow-up-right">↘</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow mb-2">{label}</dt>
      <dd className="text-[14px] text-fg leading-relaxed capitalize">{value}</dd>
    </div>
  );
}
