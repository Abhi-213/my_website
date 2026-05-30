import { motion } from 'framer-motion';
import { experiences, education, certifications } from '../data/content';

export function Experience() {
  return (
    <section id="experience" className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-28">

        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">Experience</span>
            <h2 className="h-section mt-8 text-balance">
              Intern to <span className="text-fg-muted">Data Scientist,</span> in 18 months.
            </h2>
          </div>
        </div>

        {/* Timeline */}
        <motion.ol
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="border-t border-line"
        >
          {experiences.map((e, i) => (
            <li
              key={`${e.company}-${e.period}`}
              className="grid grid-cols-12 gap-x-8 gap-y-4 py-10 md:py-12 border-b border-line"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="num-badge mb-2">— {String(i + 1).padStart(2, '0')}</div>
                <div className="font-mono text-[12px] text-fg-dim">{e.period}</div>
              </div>
              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <div className="text-[20px] md:text-[24px] font-medium tracking-tight text-fg">
                  {e.role}
                </div>
                <div className="text-[14px] text-fg-muted mt-1">
                  {e.company} · {e.location}
                </div>
                <p className="mt-5 max-w-[68ch] text-[14.5px] leading-[1.7] text-fg-dim justify-prose">
                  {e.summary}
                </p>
              </div>
            </li>
          ))}
        </motion.ol>

        {/* Education + certs */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 pt-16 md:pt-20">
          <div className="col-span-12 md:col-span-3">
            <span className="eyebrow">Education</span>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            {education.map((edu) => (
              <div key={edu.degree} className="mb-6">
                <div className="font-mono text-[12px] text-fg-dim">{edu.period}</div>
                <div className="mt-2 text-[18px] md:text-[20px] font-medium text-fg">
                  {edu.degree}
                </div>
                <div className="text-[14px] text-fg-muted mt-1">{edu.institution}</div>
                <div className="font-mono text-[12px] text-accent mt-1">{edu.meta}</div>
              </div>
            ))}
            <div className="mt-8 flex flex-wrap gap-2">
              {certifications.map((c) => (
                <span
                  key={c}
                  className="border border-line px-3 py-1 text-[11.5px] text-fg-dim"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
