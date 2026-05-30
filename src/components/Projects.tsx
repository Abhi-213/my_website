import { useState } from 'react';
import { motion } from 'framer-motion';
import { inViewProps, stagger } from '../lib/motion';
import { projects, type Project } from '../data/content';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  // Latest first
  const sorted = [...projects].reverse();

  return (
    <section id="work" className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-28">

        {/* Section header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">Selected work</span>
            <h2 className="h-section mt-8 text-balance">
              Production AI for radiology, <span className="text-fg-muted">end&nbsp;to&nbsp;end.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-[14px] leading-[1.65] text-fg-dim max-w-[40ch]">
              A selection of vision systems, LLM tools, and orchestration work shipped at 5C between
              early 2025 and now. Click any tile for the full case study.
            </p>
          </div>
        </div>

        {/* 3-col grid of project cards */}
        <motion.div
          variants={stagger}
          {...inViewProps}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={setActive} />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
