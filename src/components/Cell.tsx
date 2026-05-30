import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type CellProps = {
  n: number;
  /** the code that appears in the In [n]: box */
  code: ReactNode;
  /** what the cell prints when run */
  children: ReactNode;
  /** override the Out prompt with custom string (e.g. truthy => keep, false => hide) */
  showOut?: boolean;
  outLabel?: string;
};

/**
 * Code cell — In [n]: <code> on top, Out [n]: <children> below.
 */
export function Cell({ n, code, children, showOut = true, outLabel }: CellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
    >
      {/* IN row */}
      <div className="cell">
        <div className="cell-prompt cell-prompt-in">In [{n}]:</div>
        <div className="cell-code">{code}</div>
      </div>
      {/* OUT row */}
      {showOut && (
        <div className="cell">
          <div className="cell-prompt cell-prompt-out">
            {outLabel ?? `Out[${n}]:`}
          </div>
          <div className="cell-out">{children}</div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Markdown cell — prose, no In/Out labels (just an M marker on the side).
 */
export function MarkdownCell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="cell"
    >
      <div className="cell-prompt cell-prompt-md">M</div>
      <div className="cell-out">{children}</div>
    </motion.div>
  );
}
