import { motion } from 'framer-motion';
import { fadeUp, inViewProps } from '../lib/motion';

type Props = {
  label: string;
  title?: string;
  hint?: string;
};

export function SectionHeader({ label, title, hint }: Props) {
  return (
    <motion.div variants={fadeUp} {...inViewProps} className="mb-10 md:mb-14">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
          {label}
        </span>
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        {hint && (
          <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{hint}</span>
        )}
      </div>
      {title && (
        <h2 className="mt-4 max-w-2xl text-balance text-2xl md:text-3xl font-medium tracking-tight text-ink-900 dark:text-ink-50">
          {title}
        </h2>
      )}
    </motion.div>
  );
}
