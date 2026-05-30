import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../data/content';
import { ProjectModal } from './ProjectModal';

// Approx reading time at ~210 wpm
function readTime(blog?: string[]): string {
  if (!blog || blog.length === 0) return '—';
  const words = blog.join(' ').split(/\s+/).length;
  const min = Math.max(2, Math.round(words / 210));
  return `${min} min read`;
}

export function Blog() {
  const [active, setActive] = useState<Project | null>(null);

  // Only projects with a written case study, newest first
  const posts = projects.filter((p) => p.blog && p.blog.length > 0).reverse();

  return (
    <section id="blog" className="relative border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-28">

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">Blog</span>
            <h2 className="h-section mt-8 text-balance">
              Notes from <span className="gradient-text">production</span>.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-[14px] leading-[1.65] text-fg-dim max-w-[40ch]">
              Long-form write-ups on the projects I've shipped — what the problem was,
              what I tried, what worked, and what I learned the hard way.
            </p>
          </div>
        </div>

        {/* Blog list — vertical, magazine-like */}
        <motion.ol
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="border-t border-line"
        >
          {posts.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="border-b border-line"
            >
              <button
                type="button"
                onClick={() => setActive(p)}
                className="group grid grid-cols-12 gap-x-8 gap-y-3 w-full text-left py-8 md:py-10 hover:bg-bg-card transition-colors"
              >
                <div className="col-span-12 md:col-span-2">
                  <div className="num-badge">— {p.number}</div>
                  <div className="cat-chip mt-2">{p.domain}</div>
                </div>

                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-[22px] md:text-[28px] font-medium tracking-tight leading-[1.15] text-fg text-balance group-hover:gradient-text transition-all">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 max-w-[58ch] text-[14px] leading-[1.6] text-fg-dim">
                    {p.subtitle}
                  </p>
                  {p.blog && (
                    <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.65] text-fg-muted line-clamp-2">
                      {p.blog[0]}
                    </p>
                  )}
                </div>

                <div className="col-span-12 md:col-span-3 flex md:justify-end items-start">
                  <div className="flex items-center gap-3 text-[12px] font-mono text-fg-muted">
                    <span>{readTime(p.blog)}</span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:text-accent arrow-up-right shrink-0"
                    />
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </motion.ol>

        <div className="mt-8 text-[12px] text-fg-muted font-mono">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} · all case studies open in a reader view
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
