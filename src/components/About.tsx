import { motion } from 'framer-motion';

const paragraphs = [
  "I started at 5C in January 2025 as an AI Scientist intern. By June I'd moved into a full-time Data Scientist role. The months in between took me from cleaning noisy medical datasets to shipping models into production — and somewhere along the way it became clear how much there is to learn at the edge of vision, language, and reasoning.",
  "The vision side has been a slow, deliberate climb. I started with the standard CNN backbones (ResNet, DenseNet, EfficientNet) and from there worked through detection architectures (YOLO, RF-DETR, DINO, Detectron, Faster R-CNN, OWL-ViT) before crossing into vision-language models. SigLIP, MedCLIP, PubMedCLIP, BioMedCLIP, BiomedLM, MedGemma, MedLM, CheXagent, PaliGemma — each one opened up a new way of thinking about how images and text could connect. The fine-tuning puzzle came next: QLoRA, LoRA, GRPO, and the slightly humbling realization that adapting a huge model efficiently for medical imaging is its own discipline.",
  "Then came the LLM side, which felt like a different game. RAG with ChromaDB and FAISS, agent orchestration with LangGraph, multi-model evaluation across OpenAI, Claude, and Gemini using promptfoo and Portkey. The engineering shifted away from architecture choices and into data flow, retrieval quality, and eval rigor. What stuck with me: the model is rarely the bottleneck. It's almost always the structure around it.",
  "The newest thread is agentic AI and MCP — and this is the part I'm most excited about. The shift from passive predictors to systems that can plan, call tools, and reason across steps feels genuinely different from anything I've worked with before. Building something small enough to understand but capable enough to act intelligently — that's the line I'm trying to walk right now.",
];

export function About() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="col-span-12 md:col-span-4"
          >
            <span className="eyebrow">About</span>
            <h2 className="h-section mt-8">
              At the edge of <span className="text-fg-muted">vision,</span> <span className="text-fg-muted">language,</span> <span className="text-fg-muted">and reasoning.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="col-span-12 md:col-span-7 md:col-start-6"
          >
            <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.75] text-fg-dim justify-prose">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
