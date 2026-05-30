import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';
import type { Project } from '../data/content';

type Props = {
  project: Project;
  onOpen?: (p: Project) => void;
};

export function ProjectCard({ project, onOpen }: Props) {
  const hasBlog = Boolean(project.blog && project.blog.length);
  const clickable = hasBlog && Boolean(onOpen);
  const Wrapper: any = clickable ? motion.button : motion.div;

  return (
    <Wrapper
      variants={fadeUp}
      type={clickable ? 'button' : undefined}
      onClick={clickable ? () => onOpen!(project) : undefined}
      className={`group block w-full text-left ${clickable ? 'min-card' : 'min-card-disabled'}`}
    >
      {/* Top row: number + category */}
      <div className="flex items-center justify-between mb-12 md:mb-16">
        <span className="num-badge">— {project.number}</span>
        <span className="cat-chip">{project.domain}</span>
      </div>

      {/* Title */}
      <h3 className="text-[22px] md:text-[26px] font-medium leading-[1.1] tracking-tight text-fg mb-3 text-balance">
        {project.title}
      </h3>

      {/* One-line descriptor */}
      <p className="text-[14px] leading-[1.55] text-fg-dim text-balance mb-6">
        {project.subtitle}
      </p>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Footer: metric + arrow */}
      <div className="flex items-end justify-between gap-4 pt-6 mt-auto border-t border-line">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-fg-muted leading-relaxed max-w-[28ch]">
          {project.metric ?? project.status}
        </div>
        {clickable && (
          <span className="text-fg-muted group-hover:text-accent transition-colors text-lg arrow-up-right shrink-0">
            ↗
          </span>
        )}
      </div>
    </Wrapper>
  );
}
