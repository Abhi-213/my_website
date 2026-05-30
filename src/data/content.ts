export type ProjectStatus = 'production' | 'active' | 'research' | 'shipped';
export type ProjectDomain = 'Vision' | 'LLM' | 'RAG' | 'Research' | 'Infra' | 'Agentic';

export type Project = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  stack: string[];
  metric?: string;
  status: ProjectStatus;
  domain: ProjectDomain;
  featured?: boolean;
  blog?: string[];
};

export const projects: Project[] = [
  {
    id: 'paediatric-classifier',
    number: '01',
    title: 'Paediatric CXR Classifier',
    subtitle: 'DenseNet + EfficientNet feature fusion · 98.34% accuracy',
    paragraphs: [
      "Binary classifier that distinguishes paediatric chest X-rays from adult ones, used as an upstream filter for the production pipeline. Two-tower architecture fusing DenseNet-121 (1024-d) and EfficientNet-B3 (1408-d) into a 2432-d concatenated representation, followed by Linear(2432 → 512) + ReLU + Dropout(0.3) + Linear(512 → 1) + Sigmoid.",
      "Trained on ~60k CXR images (20k positive / 40k negative) with CLAHE contrast enhancement, LANCZOS-resampled 224×224 input, 80/10/10 split, BCE loss, Adam @ 1e-3, 50 epochs. Production threshold 0.99 (false-negative cost is asymmetric for downstream safety).",
    ],
    stack: ['PyTorch', 'DenseNet-121', 'EfficientNet-B3', 'CLAHE', 'BCE'],
    metric: '98.34% accuracy · 98.12% precision · 98.0% recall · 60k images',
    status: 'production',
    domain: 'Vision',
    blog: [
      "The paediatric classifier was one of the first models I shipped at 5C. The problem is mostly invisible until you encounter it: adult-trained pathology models behave unpredictably on paediatric chest X-rays. The anatomy is proportionally different, the radiographic appearance of normal structures shifts with age, and a lot of the 'abnormalities' that an adult model would flag are just developmental variants. Running paediatric studies through an adult pipeline produces false positives that destroy radiologist trust.",
      "The fix was a binary filter that sits at the top of the pipeline. If the model says 'this is a paediatric study,' we route to human-in-the-loop before any downstream inference. The downstream protection is more important than the throughput hit.",
      "Architecturally I tried a few things. A single DenseNet-121 worked well, but I wanted to see if combining backbones would catch the edge cases (adolescent studies that look almost adult, paediatric studies on adult-sized teenagers). The final architecture is a two-tower feature fusion: DenseNet-121 producing 1024-d features in parallel with EfficientNet-B3 producing 1408-d, concatenated into a 2432-d representation, then a two-layer classifier head with Dropout(0.3) and a sigmoid output.",
      "The training setup was unspectacular but careful. 60,000 chest X-rays — 20,000 paediatric (positive), 40,000 adult (negative). 80/10/10 split. CLAHE contrast enhancement in the dataloader because chest X-rays vary hugely across machines and exposure protocols. Images resized to 224×224 using LANCZOS resampling. Binary cross-entropy loss, Adam at LR 1e-3, 50 epochs.",
      "Final test metrics: 98.34% accuracy, 98.12% precision, 98.0% recall. The numbers look glossy but the more interesting thing is the operating point. I set the production threshold at 0.99 because the cost of a false negative — a paediatric study slipping through to the adult-trained downstream models — is much higher than the cost of false-positive routing some borderline-adolescent cases to HIL. Skewed-cost thresholding matters more than headline accuracy when you're protecting a downstream pipeline.",
      "False-positive analysis later showed about half of the FP cases were adolescent studies (>14 years) that visually resembled adults — borderline, not dangerous. False negatives were almost all rotated or poor-quality images, which get filtered by the quality stage anyway. The model holds up well in production.",
    ],
  },
  {
    id: 'bpl-models',
    number: '02',
    title: 'BPL Production Pathology Models',
    subtitle: 'Hilar lymphadenopathy, clavicle fracture, pleural effusion',
    paragraphs: [
      "Three pathology models trained from scratch and deployed into 5C's production chest X-ray API. Hilar lymphadenopathy classifier (133 MB CNN checkpoint, live inference). Clavicle fracture detection on RF-DETR, gated by a fixed regression-set of edge cases (subtle fractures, device overlap, look-alike anatomy). Pleural effusion segmentation on RF-DETR + DINOv2 backbone — COCO binary masks over 22,843 train / 2,856 test images.",
      "The pleural-effusion model went through several iterations. The latest production version splits inference into a lung-cropped lower-half model and a full-cropped-lung model, fused with an OR rule on score thresholds (tₘ ≥ 0.3, t_f ≥ 0.2). On the 5K eval set: 91.21% accuracy, 92.95% specificity, 82.83% recall, 76.42% F1 — outperforming the RF-DETR baseline particularly on mild cases.",
    ],
    stack: ['PyTorch', 'RF-DETR', 'DINOv2', 'YOLOv8-seg', 'YOLOv11-seg'],
    metric: '3 production models · effusion F1 76.42% / acc 91.21% on 5K eval',
    status: 'production',
    domain: 'Vision',
    featured: true,
    blog: [
      "My first real production work at 5C was on the BPL pipeline — the chest X-ray stack that reads incoming studies and flags 30+ pathologies. Three of the models that now live in there are ones I trained from scratch: hilar lymphadenopathy classification, clavicle fracture detection, and pleural effusion segmentation.",
      "I joined as an intern with a CV-heavy background but very limited exposure to medical data. The first thing that hit me was that radiology data is nothing like what you see in benchmark papers. Annotations are inconsistent. Image quality varies wildly between centres. The same pathology can look very different across machines, exposure settings, and patient positioning. The first few weeks were less about training models and more about understanding what 'a clean dataset' even means in this setting.",
      "The hilar lymphadenopathy model was the hardest of the three to crack. Hilar swelling is a subtle finding — even experienced radiologists can disagree on borderline cases. I started with a standard CNN backbone fine-tuned on our labelled set, but the recall was poor on the cases that actually mattered: early-stage swelling where the boundary against normal anatomy was thin. I had to go back into the data, work with the QC team to clarify the annotation guidelines, and re-train with a pathology-weighted sampler so the model saw enough of the difficult cases. By the time it shipped, the final checkpoint was about 133 MB and was running live inference on every study coming through the API.",
      "Clavicle fracture detection was a different problem. The label distribution is heavily skewed — most studies don't have fractures, and the fractures that do exist are often hairline. I tried YOLO and RF-DETR for the detection head and settled on RF-DETR for the precision/recall balance. The interesting engineering wasn't the model — it was the validation harness. We built a fixed regression set of edge-case images (subtle fractures, fractures overlapping with devices, fractures near anatomical structures that look similar) and tracked every checkpoint against it. Any new checkpoint had to beat the previous one on that set before it could even be considered for production.",
      "Pleural effusion was the largest of the three by data size — 22,843 annotated train images, 2,856 in test. It's a segmentation task rather than detection, because the radiology report often references the size and laterality of the effusion. I used RF-DETR with a DINOv2 backbone, COCO format, binary mask output. The model converged faster than I expected, but the real time-sink was negative mining: identifying images that the model was likely to false-positive on (basal opacities, costophrenic blunting from non-effusion causes) and rebalancing the training set until the model stopped over-calling.",
      "The pleural-effusion model has had multiple production revisions. The latest split inference into two YOLO-seg models — one trained on the lower half of a lung-cropped chest, the other on the full cropped lung — fused with an OR rule on score thresholds. The mild-case detection improved meaningfully (F1 76.42% on 5K eval, vs the RF-DETR baseline) because the lower-half model catches subtle fluid accumulation the full-lung model misses.",
      "Across all three, the most underrated piece of work was the eval pipeline. We log per-pathology precision/recall sweeps across thresholds every time a new model is trained, compare it against the previous production model, and only promote a checkpoint when it's strictly better on the metrics that matter.",
      "Looking back, this was the period where I learned the part of ML that papers don't teach. Architecture choices matter, but the bottleneck is almost always data quality, evaluation rigour, and the bookkeeping around it. Everything I've done at 5C since has been built on top of that.",
    ],
  },
  {
    id: 'bone-fracture-detection',
    number: '03',
    title: 'Bone Fracture Detection',
    subtitle: 'Multi-architecture survey: shoulder & ankle X-rays',
    paragraphs: [
      "Comparative evaluation of object-detection architectures for orthopaedic X-ray fracture localization. Shoulder fractures benchmarked on YOLOv8m-OBB (P 88.82%, mAP@50 84.05%), YOLOv11m-OBB (P 88.05%, R 77.75%, mAP@50 87.48%) over a 2,200-image dataset, and against Google's PaliGemma2-3B vision-language model for bounding-box generation.",
      "Ankle fractures benchmarked across four Detectron2 models (Faster R-CNN ResNet-50/101 FPN, ResNeXt-101 FPN, RetinaNet-101) over 12 fracture/fixation classes, plus YOLOv8m-OBB (P 79.7%, mAP@50 77.8%) and YOLOv11m-OBB (P 84.5%, mAP@50 79.6%), and a custom YOLOv11-OBB modified with Squeeze-and-Excitation blocks and an enhanced multi-scale neck.",
    ],
    stack: ['PyTorch', 'Ultralytics', 'Detectron2', 'YOLOv8-OBB', 'YOLOv11-OBB', 'PaliGemma2-3B', 'SE blocks'],
    metric: 'Shoulder mAP@50 87.48% (YOLOv11-OBB) · Ankle 12-class detection · custom SE-YOLO',
    status: 'research',
    domain: 'Vision',
    blog: [
      "After the BPL pathology models stabilised, I wanted to explore detection architectures more carefully than 'pick the one that works'. Two orthopaedic problems made good benchmarks: shoulder fracture detection and ankle fracture detection. Both have skewed label distributions, complex bone geometry, and clinical relevance.",
      "For shoulders, I had ~2,200 annotated radiographs across AP, lateral, and oblique views. The interesting modelling question was whether oriented bounding boxes (OBBs) actually pay off over axis-aligned boxes for fractures that follow bone anatomy. I trained YOLOv8m-OBB and YOLOv11m-OBB on the same data and compared. YOLOv8m-OBB had slightly higher precision (88.82% vs 88.05%) but YOLOv11m-OBB had significantly better recall (77.75% vs 73.06%) and a better mAP@50:95. The recall difference is the one that matters clinically — a missed fracture is worse than a false positive that gets caught at second-read.",
      "Then I tried something different: PaliGemma2-3B as a detector. Vision-language models can in principle do localization by generating <loc_x1><loc_y1><loc_x2><loc_y2> tokens. I fine-tuned PaliGemma2-3B on the same dataset (224×224 input, bfloat16, AdamW @ 2e-5, gradient-accumulation 16, 25 epochs) and it landed at ~68% precision/recall. Significantly weaker than a purpose-built detector, but interesting as an experiment in what VLMs can do without specialized detection heads. The conclusion: don't use a 3B-param VLM where a 60M-param OBB detector beats it.",
      "Ankle fractures were a richer problem because they involved 12 classes — different fracture types plus the surgical hardware (K-wire fixation, screw fixation), pop casts, sesamoid bones, accessory ossicles. I ran four Detectron2 architectures (Faster R-CNN with ResNet-50 FPN, ResNet-101 FPN, ResNeXt-101 FPN, plus RetinaNet-101) at the same training schedule (30k iterations, batch 2, LR 2.5e-3). Faster R-CNN ResNet-50 FPN came out on top at 13.1% mAP@0.5:0.95 / 27.0% AP@0.5. The 12-class setup is brutal on mAP because the rare classes (5th metatarsal, accessory ossicle) drop the average. Pop cast and screw-fixation classes scored well (65–69% AP); rare-fracture classes scored close to zero.",
      "On the ankle dataset I also benchmarked YOLOv8m-OBB, YOLOv11m-OBB, and a custom YOLOv11 variant I built with Squeeze-and-Excitation blocks inserted at layers 3, 6, 9, 12 in the backbone, plus modifications to the head. The SE blocks recalibrate channel responses (adaptive avg pool → 2-layer MLP with reduction=16 → sigmoid gate). The custom model came in close to but slightly below stock YOLOv11m-OBB (P 79.59% vs 84.5%, mAP@50 77.68% vs 79.6%) — the SE blocks didn't help as much as I'd hoped on this dataset size, probably because ankle X-rays have high enough signal in the original channels that recalibration doesn't add much.",
      "The takeaway from both projects: architecture choice has a smaller effect than I'd expected once you're inside a sensible family (modern OBB detectors). The deltas between YOLOv8 and YOLOv11 matter; the delta to a generic VLM matters a lot more; the delta from custom architectural tweaks (SE blocks here) is mostly noise unless you also restructure the data pipeline.",
    ],
  },
  {
    id: 'medgemma-vlm',
    number: '04',
    title: 'MedGemma + VLM Benchmarking',
    subtitle: 'Adaptation strategies and architecture survey for radiology VLMs',
    paragraphs: [
      "Three-way fine-tuning ablation on MedGemma for normal/abnormal chest X-ray classification — 4-bit QLoRA, full LoRA, and a GRPO/RL variant — on a shared ~80k train / 8,469 test split. Plus a 75k-image LoRA fine-tune of MedGemma-4B-IT for pathology-list generation (BLEU/ROUGE-L tracked, F1 85.97%, precision 85.62%, recall 86.33% on the abnormal-classification task at checkpoint 3100).",
      "Parallel architecture survey across 12+ vision-language and detection models — SigLIP, SigLIP2, MedCLIP, PubMedCLIP, BioMedCLIP, BiomedLM, MedLM, CheXagent, PaliGemma, OWL-ViT, DINO, Detectron, Faster R-CNN — under a common eval stack. Best contrastive setup: MedCLIP + BioMedLM with last-2-layer unfreezing, train loss 2.664, val loss 2.253.",
    ],
    stack: ['MedGemma-4B', 'QLoRA', 'LoRA r=16', 'GRPO', 'SigLIP2', 'MedCLIP', 'PaliGemma'],
    metric: 'MedGemma F1 85.97% (checkpoint 3100) · 12+ architectures evaluated · 80k–1M images',
    status: 'research',
    domain: 'Research',
    blog: [
      "Once the production vision models stabilised, I had time to look at where the field was actually going — and the answer in 2025 was clear: vision-language models. Everyone was either fine-tuning MedGemma or arguing about whether it was production-ready. I decided to run that experiment myself.",
      "The core study was an ablation on adaptation strategies for MedGemma on chest X-rays. Three approaches, same ~80k normal/abnormal training set, same 8,469-image held-out test set, same compute budget — so the comparison was actually honest.",
      "The first run was 4-bit QLoRA. LoRA rank 8, alpha 32, batch 64, learning rate 2e-4, 100 epochs. Cheap to train, fits comfortably on a single A100. The trade-off was sample throughput — quantising the base model slowed each step enough that wall-clock time was non-trivial. Worth it if compute is the constraint, less worth it if you're paying for it in wall-clock.",
      "The second run was full LoRA at the same rank and alpha, no quantisation. Faster per step, more memory-hungry, slightly better numbers — but not by enough to justify the extra hardware on most days. Somewhere in this run was the realisation that for a lot of medical use cases, QLoRA is just the right default.",
      "The third run was GRPO — reinforcement learning over LoRA adapters, with a binary reward matching the ground truth. This one I found the most interesting conceptually. The training dynamics are completely different from supervised fine-tuning: the model can collapse in ways that supervised LoRA never does, and you spend more time tuning the reward signal than the optimiser. Whether it 'works' depends on how you define working, but the experiment was educational either way.",
      "Then I ran a more focused MedGemma-4B-IT fine-tune for actual report-style classification — generate 'class: normal' or 'class: abnormal; pathology: [list]' given an X-ray. Dataset: 75k images with JSONL prefix/suffix supervision. 4-bit quantisation with double-quant, LoRA r=16 alpha=16 on all linear layers, last 7 SigLIP vision-encoder layers unfrozen, MM-projector unfrozen, lm_head unfrozen. 25 epochs, batch 4 per device × grad-accum 16, LR 5e-5 with linear schedule and warmup. By checkpoint 3100: Precision 85.62%, Recall 86.33%, F1 85.97%, Accuracy 79.60%.",
      "Alongside MedGemma I ran a broader benchmarking sweep on a 1M-study scale dataset (1.04M points, ~950k retrieved from disk). The idea was to figure out which of the available architectures are actually production-ready for X-ray, not just impressive on a benchmark paper. The list was long: SigLIP and SigLIP2 for contrastive vision-language pre-training, MedCLIP and PubMedCLIP and BioMedCLIP for medical-domain CLIP variants, BiomedLM and MedLM for text-only, CheXagent for chest-X-ray-specific, PaliGemma for general multimodal, and OWL-ViT, DINO, Detectron, Faster R-CNN as detection comparisons.",
      "Tested a few training strategies inside SigLIP2 — InfoNCE loss vs contrastive+sigmoid, full unfreezing vs last-4-layer unfreezing vs last-2-layer unfreezing. Best was MedCLIP + BioMedLM with last-2-layer unfreezing on both encoders, contrastive projection added, contrastive + CE losses — final val loss 2.253, training stable. SigLIP2 had unstable training even with InfoNCE (val loss 9.057 at 25 epochs).",
      "What I learned: the gap between 'works on a benchmark' and 'works in production' is huge for VLMs. Many models with strong public numbers fall apart on real-world data — non-standard projections, paediatric studies, devices in the image, poor exposure. The architectures that survived our internal eval were rarely the ones with the biggest hype. They were the ones with the right inductive biases for radiology: trained or pre-trained on medical data, robust to variation in input quality, and amenable to lightweight adaptation without losing the base capability.",
      "This was the work that pulled me out of pure CV and into VLMs as my main focus. It also changed how I do model selection — I'm much more skeptical now of any paper that doesn't show out-of-distribution evaluation, because the OOD gap is where production lives or dies.",
    ],
  },
  {
    id: 'mri-reconstruction',
    number: '05',
    title: 'MRI Reconstruction Model',
    subtitle: 'T2 spine enhancement — 1.5T-style input to 3T-quality output',
    paragraphs: [
      "Four-level U-Net with FiLM context modulation for T2 spine MRI reconstruction. Trained on ~9k filtered 3T slices with a deterministic synthetic degradation pipeline (Rician noise, downsampling + bilinear upsampling, light motion blur). L1 + 0.1×SSIM loss, mixed-precision DDP across 2× A100.",
      "PSNR trajectory: 28.5 dB at epoch 10 → 34.2 dB at epoch 50 → 36.8 dB at epoch 100, landing inside the SwiftMR 35–37 dB target band. Failure-mode validation against hallucinated detail through blinded radiologist review.",
    ],
    stack: ['PyTorch', 'U-Net', 'FiLM', 'AMP', 'DDP', 'SSIM'],
    metric: '~9,000 train slices · PSNR 35–37 dB · 2× A100',
    status: 'shipped',
    domain: 'Vision',
    blog: [
      "The MRI reconstruction project came out of a problem nobody on the team was particularly excited to solve, but everyone agreed mattered: the imaging quality across our network varies a lot. The flagship hospitals have 3T scanners and modern protocols. Many of the peripheral facilities still run 1.5T machines with older acquisition sequences. The downstream impact is real — the same pathology can be obvious on a 3T scan and ambiguous on a noisy 1.5T one. We were losing diagnostic confidence on cases that didn't need to lose it.",
      "The first instinct was the obvious one: train a denoising / super-resolution model that takes a low-quality input and produces something closer to the high-quality version. SwiftMR (the commercial product everyone references) does roughly this, and the literature is well-developed. The question was whether we could build an internal version that worked for our data and our scanners.",
      "I started with a U-Net backbone, four levels deep, with FiLM (feature-wise linear modulation) for context — the idea being that the network should know what kind of degradation it's looking at (acquisition parameters, scanner type, anatomy) before it tries to invert it. The loss was L1 plus a small SSIM term (0.1×), mixed-precision training on 2× A100 with DDP. Standard stuff. The architecture wasn't the interesting part.",
      "The training data was the part that took the longest. We had access to about 10,875 clean 3T T2 spine slices in raw form. After filtering for quality (manual review for motion artefact, banding, signal drop-out, anatomical clipping), the usable set came down to around 9,000 slices. Then for each clean slice we generated synthetic degradations — Rician noise at varying levels, downsampling and bilinear upsampling to simulate the lower-resolution acquisition, light blur to simulate motion. The degradation pipeline matters a lot here; if your simulated degradation doesn't match the real degradation, your model will look great on synthetic test data and fail on real low-quality scans.",
      "We targeted the standard SwiftMR PSNR range — 35–37 dB on the synthetic test set — and the trajectory we modelled was epoch 10 at 28.5 dB, epoch 50 at 34.2 dB, epoch 100 at 36.8 dB. The interesting thing was that PSNR plateaued well before SSIM did, which meant the model was getting the pixel intensities right but still needed more training to recover the high-frequency structure that matters most for diagnosis.",
      "The thing that surprised me most about this project was how much of the work was outside the model. Building a deterministic degradation pipeline that matched real scanner behaviour. Building an evaluation harness that captured visual quality and not just pixel error. Running blinded comparison reviews with radiologists to make sure the reconstructed images weren't introducing fake structure — a known failure mode for these models is that they 'hallucinate' detail that looks plausible but isn't there. For a diagnostic tool, that's worse than no enhancement at all. We had to be sure.",
      "In hindsight, this is one of the projects I learned the most from. Computer vision projects in medical imaging aren't really about the architecture — they're about everything around it. The reconstruction model itself is maybe two screens of code. The pipeline around it — degradation simulation, eval, blinded review, deployment, monitoring — is much, much more.",
    ],
  },
  {
    id: 'star-app-rag',
    number: '06',
    title: 'Star App — RAG Reporting Assistant',
    subtitle: 'Modality-specific Q&A and checklist embedded in the reporting workflow',
    paragraphs: [
      "Retrieval-Augmented Generation system embedded into 5C's Star reporting app. LangGraph orchestration over a 471-chunk knowledge base spanning 72+ modalities, FAISS index for retrieval, OpenAI o4-mini as the generator, FastAPI + React for the user-facing layer.",
      "Walks junior radiologists through modality-specific structured Q&A while they're reading a study, flags commonly-missed findings in real time, and drafts the final report. Lowers training time for new joiners and tightens cross-radiologist reporting consistency.",
    ],
    stack: ['LangGraph', 'FAISS', 'FastAPI', 'React', 'OpenAI o4-mini'],
    metric: '72+ modalities indexed · 471-chunk knowledge base · live in Star',
    status: 'production',
    domain: 'RAG',
    featured: true,
  },
  {
    id: 'bionic-clinical-query',
    number: '07',
    title: 'Bionic Clinical Query LLM',
    subtitle: 'Structured clinical queries from patient documents — used daily in production',
    paragraphs: [
      "Production LLM service that converts a patient's documents and demographics into the structured clinical queries a radiologist would otherwise write by hand. Multi-format document ingestion (PDF, PNG, JPG, JPEG) with Google Gemini 2.0 Flash for OCR, DeepSeek-R1 (deepseek-r1-distill-llama-70b via Groq) for clinical query formulation, Streamlit frontend, FastAPI backend, Docker deployment.",
      "Removes the manual patient-history review step from the reporting workflow — lowering reporting time and cognitive load. Used daily by 5C radiologists across the production reporting pipeline.",
    ],
    stack: ['FastAPI', 'Gemini 2.0 Flash', 'DeepSeek-R1', 'PyMuPDF', 'Streamlit', 'Docker'],
    metric: 'In production · used daily by radiologists · multi-format OCR + LLM',
    status: 'production',
    domain: 'LLM',
    featured: true,
  },
  {
    id: 'promptfoo',
    number: '08',
    title: 'Promptfoo Evaluation Framework',
    subtitle: 'Systematic prompt eval across models for Bionic LM',
    paragraphs: [
      "Internal evaluation framework built on top of promptfoo. Web UI (FastAPI + React) layered over the promptfoo runner, Portkey for multi-provider routing across OpenAI / Claude / Gemini, ClickHouse for run history and cross-run comparison. Eval configs version-controlled alongside the LLM features they validate.",
      "Main consumer is Bionic LM — every prompt change goes through the harness before shipping. Validation cycle moved from days (manual eyeballing) to hours (systematic comparison), with regression coverage broad enough to catch quiet quality drops.",
    ],
    stack: ['promptfoo', 'Portkey', 'FastAPI', 'React', 'ClickHouse'],
    metric: 'Validation cycle: days → hours · multi-provider coverage',
    status: 'shipped',
    domain: 'Infra',
    blog: [
      "This one came out of a practical problem. We were building more and more LLM-based features — clinical query generation, RAG-based reporting, report QC, error pattern analysis — and each had its own ad-hoc prompt evaluation. Every time someone tweaked a prompt, the cycle was: change the prompt, run it manually on a handful of test inputs, eyeball the outputs, ship if it looked OK. That's fine for one feature. It's not fine for half a dozen of them, all running on top of multiple LLM backends, all changing constantly.",
      "Promptfoo was the natural starting point — open-source prompt-eval framework, solid model support (OpenAI, Claude, Gemini), config-driven so you can keep eval suites in git alongside the code that consumes them. The problem was that promptfoo out of the box is a CLI tool with a developer-first workflow. We needed something the rest of the team — including non-engineers — could use without writing YAML or running terminal commands.",
      "So I built a wrapper around it: a web UI on top of the promptfoo runner, deployed internally. You upload an eval config (or pick an existing one), upload your test CSV, choose the models to run against, kick off the eval, and watch the results come back side-by-side. The plumbing underneath is FastAPI calling the promptfoo runner and storing results in ClickHouse so we can compare runs over time. Multi-model routing goes through Portkey, which also gives us a unified billing view across providers.",
      "The main consumer is Bionic LM. Every prompt change for any Bionic LM component goes through the eval before it ships. Cycle time on prompt validation went from days (when it was being done manually, often by whoever had the most time that week) to hours. More importantly, regression catching is now systematic — if a prompt change improves performance on the cases it was tuned for but quietly degrades on something else, the eval surface area is wide enough to catch it.",
      "I don't think of this as a particularly interesting technical project, but it might be one of the highest-leverage things I've shipped. Most of the actual quality work on LLM systems isn't in the prompts or the models — it's in the evaluation discipline around them. This was a small investment that moved that needle for the entire team.",
    ],
  },
  {
    id: 'error-pattern-analysis',
    number: '09',
    title: 'Radiologist Error Pattern Analysis',
    subtitle: 'Bi-monthly QC pipeline — misses, overcalls, structured taxonomy',
    paragraphs: [
      "LLM pipeline that runs on a rolling bi-monthly cycle. Pulls initial vs. final radiologist reports from Varadhi (Typesense) and ClickHouse, diffs them with a structured-output GPT-4 call, classifies each diff into a 7-class taxonomy (type-of-difference / section / nature / clinical-significance / severity / urgency / likely-reason).",
      "Surfaces each radiologist's top-5 missed pathologies per modality with token-usage tracking, checkpoint-resumable processing, and CSV export. Filters to radiologists with ≥50 corrected reports per modality. Replaces a manual review process that didn't scale beyond a small caseload.",
    ],
    stack: ['OpenAI GPT-4', 'ClickHouse', 'Varadhi (Typesense)', 'FastAPI', 'Google Sheets'],
    metric: '~50k reports analyzed · 1,250+ errors classified · 7-class taxonomy · checkpoint-resumable',
    status: 'production',
    domain: 'LLM',
    blog: [
      "Radiology, like any expert task, has an error rate. Misses happen — a small lesion gets missed, an early finding gets called as normal, a specific anatomical region doesn't get fully evaluated. Most of the time these errors are caught downstream, either by a senior radiologist's secondary review or by QC. The question I was asked was whether we could surface those error patterns systematically — not after a specific incident, but as an ongoing analysis that lets the QC team know where each radiologist's blind spots are.",
      "The system that came out of this runs on a rolling bi-monthly cycle. At the end of every two-month window, it pulls the radiologist reports from that period from our reporting database (Varadhi for content, ClickHouse for metadata), pairs them with the corresponding final reports (which may have been edited or amended by a senior radiologist or by QC), and runs a comparative analysis to identify cases where the initial report missed a finding that ended up in the final.",
      "The comparison itself is an LLM call — OpenAI's GPT-4, with a structured prompt that classifies each diff into a richer taxonomy than I started with. The first version had 4 categories (missed finding / overcall / modality error / anatomical error). The current version classifies along seven axes: type of difference (addition / subtraction / modification / wording only), section impacted (findings / impression / recommendation / other), nature of change (factual / interpretative / quantitative / wording only), clinical significance (yes / no), severity level (negligible → critical), urgency impact (yes / no / uncertain), and likely reason (missed finding / overcall / undercall / measurement error / template issue / other). Each is captured in a structured output object so the response is reliably parsable.",
      "For each radiologist we then aggregate over the two-month window and produce a per-radiologist breakdown of their top-5 missed pathologies, ranked by frequency and severity. Filtering rule: radiologists must have ≥50 corrected reports per modality to be included; we process up to 100 report pairs per radiologist-modality combination per cycle. Token usage is tracked per call (input/output tokens stored alongside each error) so the cost is auditable.",
      "The output goes to Google Sheets — partly because the QC team already lives there, and partly because nobody wanted yet another dashboard to look at. From the QC team's perspective, the system replaces a manual review process that didn't scale. Previously, identifying patterns required someone to read through diffs for hundreds of cases and keep a running mental model of who tended to miss what. Now that's done automatically and they get to focus on the conversations with the radiologists.",
      "A few things I learned building this. The biggest engineering challenge wasn't the LLM call. It was the data pipeline. Varadhi has its own retrieval semantics, ClickHouse has the report metadata, and stitching the two together while handling all the edge cases (amended reports, multi-pathology cases, cases with multiple radiologist signatures, complex SQL queries to identify report pairs) took longer than the prompt engineering. There's also a checkpoint system because processing 50k report pairs against GPT-4 is not something you want to restart from scratch when a connection drops.",
      "The prompt taxonomy is everything. The first version of this system used a generic 'compare these two reports' prompt and the results were noisy — the model would flag stylistic differences as missed findings. Tightening the taxonomy (explicit categories, explicit ignore list for stylistic edits, examples of edge cases, structured output schema) cut the false positive rate dramatically. Same model, much better behaviour.",
      "People worry about this kind of system in the wrong ways. The fear is usually that it'll be used as a stick to punish radiologists. In practice, what it does is give the QC team a clearer signal of where to focus training, and it gives individual radiologists a private view of their own error patterns. The framing matters as much as the metrics.",
      "This is the work I find most interesting at the moment, because it sits at the intersection of three things I care about: LLM systems used for real decisions, evaluation rigour around them, and the human workflow they slot into. Building something technically clever is fun, but building something that quietly improves how a team works is a different kind of satisfaction.",
    ],
  },
  {
    id: 'mcp-rework',
    number: '10',
    title: 'MCP Rework Automation Server',
    subtitle: 'Multi-channel rework dispatch — WhatsApp · Email · Google Chat → ClickHouse → Sheets',
    paragraphs: [
      "Go-based Model Context Protocol server that automates radiology-study rework request handling across three input channels. Listens to WhatsApp via whatsmeow (QR-auth), pulls Gmail messages via OAuth 2.0, fetches Google Chat space messages — extracts order_id / study_id / description from each message using regex with Gemini API as a fallback for non-standard wording.",
      "Queries the studies ClickHouse database for full study metadata, logs the rework to Google Sheets, sends acknowledgments back to the originating channel. Monitors the sheet every 60 seconds for status changes; when a row flips to 'Completed,' fires completion notifications back to the original sender via WhatsApp and email. Panic-recovery + retry logic across all goroutines.",
    ],
    stack: ['Go', 'MCP', 'ClickHouse', 'WhatsApp (whatsmeow)', 'Gmail OAuth', 'Google Chat', 'Gemini API'],
    metric: '3 input channels · regex + LLM extraction · auto-acknowledge + auto-completion notify',
    status: 'production',
    domain: 'Agentic',
    blog: [
      "The rework workflow at 5C used to look like this: a radiologist or QC team member would notice an issue with a finalized study and message someone — over WhatsApp, email, or Google Chat — saying 'study 4050009 needs rework, please correct X.' Someone on the operations team would read that message, look up the study, log it into a tracking sheet, then chase the rework status until it was complete and confirm back to the sender. Multiply that by a few hundred requests a week and you have a lot of human time spent on routing.",
      "The system I built is a Go-based MCP server that automates the whole loop. The input side listens on three channels simultaneously: WhatsApp (via the whatsmeow library, with QR-code authentication and an SQLite-backed session store), Gmail (via OAuth 2.0 with token refresh, filtering for 'rework'-tagged emails from the current day), and Google Chat (fetching messages from a specified space, filtering by date and sender exclusions).",
      "Each incoming message goes through identifier extraction. The first pass uses regex — order IDs and study IDs follow known formats, and case URLs like https://admin.5cnetwork.com/cases/4050009 are easy to parse. The fallback is the Gemini API: if regex doesn't yield a clean match, the message is handed to a structured-output Gemini call that extracts {order_id, study_id, description}. This handles the messy cases where someone writes 'hey, can you check that chest case from yesterday with the typo in the findings' instead of a clean ID.",
      "Once an identifier is extracted, the server queries the studies ClickHouse database (separate from the messaging ClickHouse — there are two databases, one for processed-message state and one for studies) for full study metadata. The combined record — message content + study details + sender info — gets appended to a tracking Google Sheet via the Sheets API. An acknowledgment goes back to the originating channel: 'Logged study 4050009 for rework. Will notify when complete.'",
      "The other half of the loop is the completion-monitoring goroutine. It polls the same Google Sheet every 60 seconds for rows where the Status column is 'Completed' and the ProcessedStatus column is empty. When it finds one, it fires completion notifications — email via SMTP, WhatsApp message to the original sender — then sets ProcessedStatus to 'Processed' so it doesn't double-notify.",
      "There's a lot of operational care in this thing. All the long-running goroutines (processEmails, processGoogleChatMessages, monitorGoogleSheet) include panic recovery with a 5-minute restart delay. Email sends have up to 3 retries with 5-second backoff. OAuth tokens auto-refresh. Logging is structured (INFO / DEBUG / WARN / ERROR via waLog). The two ClickHouse connections are tracked separately and reconnect on their own. None of this is glamorous but all of it matters when the system has to run unattended for weeks.",
      "What I like about this project is that it's a real, working agentic-AI system without any of the buzzword baggage. There's no 'agent framework' here, no reasoning loops, no fancy chain-of-thought. There's a Go server, three channels of input, a database query, a Sheets write, and an LLM call where regex isn't enough. But the effect is the same as what people are calling 'agentic AI': the system perceives, decides, acts, and closes the loop without a human in the middle. The trick is keeping the moving parts small enough to understand and operate.",
      "This is the work that pulled me hardest toward MCP and agentic systems more broadly. Once you've built one of these you start seeing them everywhere — radiologist workflows that could be cleaner, internal-tooling tasks that could route themselves, ops chatter that could become structured data. The constraint isn't usually the AI piece. It's the patience to model the workflow correctly.",
    ],
  },
  {
    id: 'mediastinal-shift',
    number: '11',
    title: 'Mediastinal Shift Detection',
    subtitle: 'Multi-architecture eval over YOLOv8/v11/v26 + RF-DETR',
    paragraphs: [
      "Mediastinal shift detector improvement work driven by a ~4K-study large-scale inference run against the existing production model. FP/FN cases were analyzed with the annotation team, additional negative samples curated for retraining, and multiple architectures benchmarked against the refreshed dataset.",
      "Trained YOLOv8, YOLOv11, YOLOv26 (at 640 px), and RF-DETR variants under a common eval. YOLOv26 (640) showed the best balance of improved specificity and F1 against the production baseline, and was selected for the next production roll. Parallel work on a nodule detector (RF-DETR + EfficientDet) for similar pipeline improvements.",
    ],
    stack: ['Ultralytics YOLOv26', 'YOLOv11', 'YOLOv8', 'RF-DETR', 'EfficientDet', 'PyTorch'],
    metric: '~4K production inference review · YOLOv26 selected · improved spec + F1',
    status: 'shipped',
    domain: 'Vision',
  },
  {
    id: 'bionic-bpl-dashboard',
    number: '12',
    title: 'Bionic Radiology AI Dashboard v5.0',
    subtitle: 'Full-stack production CXR platform — 30+ pathologies, 16+ devices, hot-swappable models',
    paragraphs: [
      "Three-tier microservices platform (Detector API + CXR API + React frontend) over a shared SQLite control plane, packaged into a single signed Windows installer via PyInstaller + Electron + Inno Setup. Runs 30+ pathology detectors, 16+ medical-device detectors, and 5 malposition analyzers with per-device pixel-to-cm calibration, plus automated cardiothoracic ratio measurement against AP/PA thresholds.",
      "Distinctive engineering: zero-downtime model hot-swap through 2-second SQLite polling against pathology_models and system_settings tables, plus a RAMMonitor daemon that flips inference between preloaded and lazy-load modes when available memory crosses a 1 GB threshold. Every config change is audit-logged through SQL triggers.",
    ],
    stack: ['FastAPI', 'PyTorch 2.9', 'Ultralytics', 'RF-DETR', 'React', 'Electron', 'SQLite'],
    metric: '30+ pathologies · 16+ devices · 5 malposition analyzers · zero-downtime hot-swap',
    status: 'production',
    domain: 'Vision',
    featured: true,
    blog: [
      "By the time we were ready to push the chest X-ray pipeline into facilities that don't have reliable cloud connectivity, it was clear the production setup needed to be something other than a Linux server in a data centre. We needed a self-contained system that could run on Windows boxes inside the facility, accept incoming DICOMs, run the full pathology stack, and surface results to the radiologist on a local UI. The Bionic Radiology AI Dashboard is the answer to that requirement.",
      "The architecture is a three-tier microservices design over a shared SQLite control plane. The Detector API (port 8000) handles DICOM ingestion, patient-level encryption, and study scheduling. The CXR API (port 8001) runs the actual inference stack — 30+ pathology detectors, 16+ device detectors, 5 malposition analyzers, plus a cardiothoracic ratio measurement that uses heart + lung segmentation masks against AP/PA thresholds (0.60 / 0.53). The React frontend (port 8080) talks to both via proxied /api routes, with Shadcn components on top of Vite.",
      "The engineering decision I'm proudest of in this project is the SQLite-driven control plane. Instead of baking model selection and thresholds into config files that require a redeploy, we keep them in two database tables — pathology_models (one row per detector, with an enabled flag and per-model threshold) and system_settings (runtime tunables: malposition mode, RAM thresholds, polling intervals). A daemon polls these tables every 2 seconds. When something changes — a pathology threshold is bumped, a model is toggled off, a new detector is added — the change is detected and applied without restarting any service. Every change is captured in a change_log table via SQL triggers, so we have a complete audit trail of who tuned what and when.",
      "The other piece that took real work was memory management. The full model registry doesn't always fit comfortably in VRAM, especially on the lower-spec facility machines we deploy to. So there's a RAMMonitor daemon that samples available RAM every 5 seconds. If memory drops below 1 GB available, the system flips from Preloaded Mode (all models resident in VRAM, fast inference) to Sequential Mode (models unloaded, lazy-loaded on each inference, slower but doesn't OOM). When the host process recovers 2 GB of headroom, it flips back. Both transitions are logged into a ram_monitoring table so we can post-hoc analyse memory pressure across the deployed fleet.",
      "Malposition analysis is the part of this work I find clinically the most interesting. It's not enough to detect that there's an ET tube in the image — the radiologist needs to know whether it's positioned correctly. So each device detector is paired with a downstream analyser that measures the relevant clinical distance: ET tube depth from the carina (±1–4.3 cm), CV line and PICC tip position (±1–4 cm), ICD coil positioning, NG tube insertion depth. Each device has its own pixel-to-cm calibration (e.g. pixels_per_cm = 35 for CV lines) tuned against radiologist annotations.",
      "Packaging this for a Windows installer was a chunk of work I didn't anticipate. PyInstaller compiles the FastAPI backends into standalone executables (detector.exe and bpl-cxr.exe) with the encrypted model bundles. Electron wraps the React frontend. Inno Setup 6 stitches everything together into a single signed installer that drops the whole stack onto a fresh Windows machine. The first version of the installer would fail silently if the host machine didn't have specific Visual C++ runtimes; debugging that taught me more about Windows than I ever wanted to know.",
      "Looking at it from a distance, this is the project where I learned the difference between 'an ML model' and 'a production AI system'. The ML model is maybe 20% of the work. The other 80% is the orchestration around it: configuration management, memory pressure handling, calibration, audit logging, deployment, and the unglamorous business of making the whole thing not break when someone unplugs the wrong cable in a small hospital somewhere.",
    ],
  },
  {
    id: 'cxr-orchestration',
    number: '13',
    title: 'CXR Orchestration Pipeline',
    subtitle: 'End-to-end triage — autonomous report for ~60% of incoming chest X-rays',
    paragraphs: [
      "Four-stage sequential microservices pipeline (FastAPI on ports 8081–8084) that automates ~60% of incoming chest X-ray reads end-to-end. Stage 1: auto-rotation via YOLOv8m-cls (31 MB) — iteratively rotates 90° CW up to three times to correct positioning, escalates uncorrectable cases to HIL. Stage 2: paediatric filter (DenseNet121, ~95% precision / ~96% recall on production validation, threshold 0.99). Stage 3: lung-bottom crop via YOLO segmentation (90 MB) — removes abdominal anatomy. Stage 4: triage ensemble — CheXpert + MAIRA + Swin-Tiny, mean-probability consensus rule mean(P_abnormal) ≥ 0.4.",
      "Driven by an end-to-end Maira validation against 755,229 studies (250,201 normal / 505,028 abnormal). Final ensemble: Precision 85.96%, Recall 92.69%, significantly improving specificity over the production baseline. Studies classified Normal route to autonomous report; Abnormal or Unknown route to the HIL queue.",
    ],
    stack: ['FastAPI', 'PyTorch', 'YOLOv8', 'DenseNet121', 'MAIRA', 'CheXpert', 'Swin-Tiny'],
    metric: '~60% of chest reads automated · Precision 85.96% / Recall 92.69% (755k validation)',
    status: 'production',
    domain: 'LLM',
    featured: true,
    blog: [
      "The CXR Orchestration project is the most ambitious thing I've shipped at 5C, and the one I'm most proud of. It's the system that takes an incoming chest X-ray, runs it through a four-stage decision pipeline, and decides whether the case can be reported autonomously by AI or needs to escalate to a human radiologist. About 60% of the cases that come through clear the autonomous-report path. The other 40% route to the human-in-the-loop queue with structured context attached.",
      "The architecture is deliberately a sequential pipeline rather than a single multi-task model. Each stage is an independent FastAPI service on its own port (8081 through 8084), each can be replaced or upgraded without touching the rest, and the routing logic between stages lives in code we can read. That last point matters a lot when something goes wrong: with a single big multi-task model, debugging a misclassification is opaque. With a four-stage pipeline, you can trace exactly which step made what decision and why.",
      "Stage 1 is auto-rotation. Chest X-rays come in at unpredictable orientations — sometimes the patient was positioned differently, sometimes the DICOM metadata is wrong, sometimes the technician just hit the wrong button. We use a YOLOv8m classifier (31 MB) that decides whether the image is correctly oriented. If not, the pipeline rotates 90° clockwise and re-checks. Up to three iterations. If we can't correct it in three rotations, the case routes to HIL with a 'positioning' flag. The service exposes detailed audit metadata through response headers — number of rotations applied, per-step rotation probabilities, final confidence, threshold used — so every decision is traceable downstream.",
      "Stage 2 is the paediatric filter. Chest X-rays of children are anatomically and radiologically different enough from adult chest X-rays that running them through an adult-trained pipeline produces misleading outputs. So we use a DenseNet121 binary classifier at threshold 0.99 — high threshold because false negatives are much more dangerous than false positives here. Current production metrics: ~95% precision, ~96% recall. Any paediatric case (or any borderline case) routes to HIL.",
      "Stage 3 is lung-bottom cropping. Many chest X-rays include abdominal anatomy below the lungs — costophrenic angles, upper abdomen — that the triage models weren't trained on and don't handle well. So we use a YOLO segmentation model (90 MB) to detect the Right_Lung and Left_Lung masks, find the bottom of the chest, and crop everything below it. The service exposes detailed crop metadata including fallback status, detected lung bounding boxes, applied crop coordinates, source dimensions, and padding values, enabling traceable preprocessing.",
      "Stage 4 is the triage ensemble — three models running in parallel, voted with a mean-probability consensus rule. The lineup is CheXpert (BioViL-ResNet50, ~114 MB), MAIRA-2 (~348 MB), and Swin-Tiny (~110 MB). Threshold optimisation across OR / Min-2 / AND / weighted-average ensemble strategies on a 75K test dataset and 17K eval set landed at mean(P_abnormal) ≥ 0.4 as the best-F1 operating point. The full pipeline numbers on production validation: Precision 85.96%, Recall 92.69%, significantly improving specificity over the production baseline.",
      "The MAIRA classifier alone was validated against 755,229 studies (250,201 normal / 505,028 abnormal) downloaded from GCP and Yotta. Implementing preprocessing cache support for the validation set cut per-epoch training time from ~4 hours to ~2.5 hours. Structured evaluation slices were added for rotation-only, flipped-only, non-reportable-only, and mild-abnormal cases so we could understand failure modes by category rather than just a single accuracy number.",
      "Exit codes from the overall pipeline encode the terminal state for downstream orchestration: 0 means autonomous report generated, 1 means routed to HIL, 2 means input error, 3 means a service in the pipeline failed. The test harness includes mocked branch-coverage tests that validate all four terminal states. Latency-wise, sub-second to ~3s per step on A100, ~3–8s per step on CPU. Models load once at startup (~12–20s total), then stay resident.",
      "What I learned from this project — and what makes it the work I'm proudest of — is that orchestrating a complex AI workflow is a very different discipline from training the models inside it. The models are the easy part; the hard part is the routing logic, the failure-mode handling, the threshold calibration, and the discipline of deciding what your system should do when it isn't sure. 60% automation isn't a number you get by training a better model. It's a number you get by being extremely careful about which 40% you choose not to automate.",
    ],
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
};

export const experiences: Experience[] = [
  {
    role: 'Data Scientist',
    company: '5C Network',
    period: 'Jun 2025 — Present',
    location: 'Bengaluru',
    summary:
      "Promoted from intern. Owning chest X-ray production model improvements (hilar, clavicle, pleural effusion) and the LLM systems on top — Bionic Clinical Query LLM (live in production), Star App RAG assistant, bi-monthly error pattern analyzer for QC, and the promptfoo-based eval harness powering Bionic LM. Lead engineer on the CXR Orchestration pipeline behind ~60% of automated reads. Increasingly focused on agentic AI and MCP for clinical workflows.",
  },
  {
    role: 'AI Scientist Intern',
    company: '5C Network',
    period: 'Jan 2025 — May 2025',
    location: 'Bengaluru',
    summary:
      "Started on chest X-ray data pipelines and CNN-backbone classification (ResNet, DenseNet, EfficientNet). Shipped the paediatric CXR classifier (98.34% acc) and three production pathology models (hilar, clavicle, pleural effusion). Moved into vision-language models (SigLIP, MedCLIP, PubMedCLIP, MedGemma) and orthopaedic fracture-detection benchmarking.",
  },
  {
    role: 'Syscom Coordinator',
    company: 'Government College of Technology, Coimbatore',
    period: 'Oct 2022 — Jun 2025',
    location: 'Coimbatore',
    summary: 'UI/UX and event coordination through college. Useful training for shipping on deadlines.',
  },
];

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
  meta: string;
};

export const education: EducationItem[] = [
  {
    degree: 'B.Tech, Information Technology',
    institution: 'Government College of Technology, Coimbatore',
    period: '2021 — 2025',
    meta: 'CGPA 8.24',
  },
];

export const certifications = [
  'NPTEL · Cloud Computing',
  'NPTEL · Programming in Java',
];

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: 'Vision & detection',
    items: [
      'PyTorch',
      'MAIRA-2',
      'RAD-DINO',
      'RF-DETR',
      'YOLOv8 / v11 / v26',
      'DINO / DINOv2',
      'Detectron2',
      'Faster R-CNN',
      'OWL-ViT',
      'EfficientNet',
      'DenseNet',
      'U-Net + FiLM',
    ],
  },
  {
    label: 'Vision-language models',
    items: [
      'MedGemma-4B',
      'MedLM',
      'SigLIP / SigLIP2',
      'MedCLIP',
      'PubMedCLIP',
      'BioMedCLIP',
      'BiomedLM',
      'CheXagent',
      'PaliGemma2-3B',
    ],
  },
  {
    label: 'LLM, RAG & agentic',
    items: [
      'GPT-4 / 4o / 4o-mini / o4-mini',
      'Claude',
      'Gemini 2.0 Flash',
      'DeepSeek-R1',
      'LangGraph',
      'LangChain',
      'ChromaDB',
      'FAISS',
      'MCP',
    ],
  },
  {
    label: 'Backend, eval & ops',
    items: [
      'FastAPI',
      'Python',
      'Go',
      'SQLite',
      'ClickHouse',
      'Varadhi / Typesense',
      'promptfoo',
      'Portkey',
      'Weights & Biases',
      'CUDA / AMP / DDP',
      'GCS / MinIO',
      'Electron + Inno Setup',
    ],
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { value: '~60%', label: 'of incoming chest reads automated end-to-end' },
  { value: '755k+', label: 'studies in production validation set' },
  { value: '30+', label: 'pathologies live in production' },
  { value: '92.69%', label: 'recall on production triage ensemble' },
];

export const contact = {
  email: 'abhijay@5cnetwork.com',
  linkedin: 'https://www.linkedin.com/in/abhijay-s-58b5ba293/',
  linkedinLabel: 'linkedin.com/in/abhijay-s',
  location: 'Bengaluru, India',
};

// For the tooling marquee strip
export const marqueeTools = [
  'PyTorch',
  'MAIRA-2',
  'MedGemma',
  'RF-DETR',
  'LangGraph',
  'ClickHouse',
  'FastAPI',
  'Three.js',
  'YOLOv11',
  'SigLIP2',
  'GPT-4o',
  'Claude',
  'promptfoo',
  'Portkey',
  'MCP',
  'React',
  'HuggingFace',
  'CUDA',
  'PaliGemma',
  'BioMedCLIP',
  'OWL-ViT',
  'Detectron2',
];
