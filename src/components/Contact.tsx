import { motion } from 'framer-motion';
import { contact } from '../data/content';

export function Contact() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-[1100px]"
        >
          <span className="eyebrow">Contact</span>
          <h2 className="mt-8 font-medium tracking-ultra leading-[0.92] text-balance text-[56px] md:text-[112px]">
            Let's <span className="text-fg-muted">build</span><br />
            something <span className="text-fg-muted">together.</span>
          </h2>

          <div className="mt-16 md:mt-20 grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 md:col-span-5">
              <p className="text-[15px] md:text-[16px] leading-[1.7] text-fg-dim max-w-[44ch]">
                If you're working on radiology AI, agentic systems in healthcare, or just
                want to compare notes on fine-tuning VLMs — drop me a line.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 bg-fg text-bg px-5 py-3 text-[13.5px] font-medium hover:bg-accent transition-colors"
                >
                  <span>Send a message</span>
                  <span className="arrow-up-right">↗</span>
                </a>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <ul className="divide-y divide-line border-y border-line">
                <Row label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                <Row label="LinkedIn" value={contact.linkedinLabel} href={contact.linkedin} external />
                <Row label="Location" value={contact.location} />
                <Row label="Currently" value="Open to ML / AI engineering roles" />
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="group flex items-center justify-between py-4 px-1 transition-colors hover:text-fg">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-muted w-32 shrink-0">
        {label}
      </span>
      <span className="flex-1 text-right text-[14.5px] text-fg-dim group-hover:text-fg transition-colors">
        {value}
      </span>
      {href && (
        <span className="ml-4 text-fg-muted group-hover:text-fg arrow-up-right">
          ↗
        </span>
      )}
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
