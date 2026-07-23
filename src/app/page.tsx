"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { SlideToUnlock } from "@/components/ui/slide-to-unlock";
import { Keyboard } from "@/components/ui/keyboard";
import { DitherShader } from "@/components/ui/dither-shader";
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from "@tabler/icons-react";
// ─── DATA ─────────────────────────────────────────────────────────────────────

const roles = ["Full-Stack Developer.", "AI Engineer.", "Open Source Builder.", "Problem Solver."];

const skills = [
  "React", "Next.js", "TypeScript", "Python", "Node.js",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "Redis",
  "Machine Learning", "LangChain", "REST APIs", "GraphQL",
  "Framer Motion", "TailwindCSS", "Git",
];

const projects = [
  {
    quote: "Mem.ai is a unified agentic memory framework that combines semantic recall, event timelines, and procedural workflows. It’s designed as a drop‑in memory layer with connectors for LangChain, LlamaIndex, AutoGen, and more.",
    name: "mem.ai",
    designation: "Agentic Memory Framework · Python",
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    repoUrl: "https://github.com/SakuDaku05/mem.ai"
  },
  {
    quote: "An orchestration framework for AI agents to automate workflows, streamlining complex task execution with customizable pipelines.",
    name: "OrchtrAI",
    designation: "AI Orchestration · Python",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    repoUrl: "https://github.com/SakuDaku05/OrchtrAI"
  },
  {
    quote: "Self-evolving systems mimicking evolutionary patterns for optimization and automated problem solving.",
    name: "SelfEvo",
    designation: "Evolutionary Algorithms · Python",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    repoUrl: "https://github.com/SakuDaku05/SelfEvo"
  },
  {
    quote: "A specialized routing tool designed for deep navigation and complex network path finding across varying topographies.",
    name: "ScubaRouter",
    designation: "Networking · Python",
    src: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop",
    repoUrl: "https://github.com/SakuDaku05/ScubaRouter"
  },
];

const quotes = [
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman" },
  { text: "Competition is for losers.", author: "Peter Thiel" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla" },
  { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
];

const codeSnippets = [
  {
    name: "Developer Initialization",
    language: "Bash",
    code: `$ git config --global user.name "SakuDaku05"

# Establishing identity...
$ git commit -m "Initial commit: Building AGI."
[main (root-commit) 05sd7a] Initial commit: Building AGI.
 1 file changed, ∞ insertions(+)
 create mode 100644 brain.py`
  },
  {
    name: "Gradient Descent",
    language: "Python",
    code: `def gradient_descent(X, y, w, lr):
    # Plz converge plz converge plz...
    for _ in range(1000):
        # Magic math from StackOverflow
        grad = X.T.dot(X.dot(w) - y) / len(y)
        w -= lr * grad
        
    return w # Hope this isn't a local minimum`
  },
  {
    name: "Self-Attention",
    language: "PyTorch",
    code: `def self_attention(Q, K, V):
    # GPUs are all you need.
    d_k = Q.size(-1)
    
    # Dot product goes brrrrr
    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)
    
    # Softmax magic = AGI achieved
    return F.softmax(scores, dim=-1) @ V`
  },
  {
    name: "Q-Learning (Bellman)",
    language: "Python",
    code: `def q_update(Q, s, a, r, next_s):
    # Bellman eq: sounds fancy, just a table update
    best_next = np.max(Q[next_s])
    
    # Update with a hint of existential dread
    Q[s, a] += 0.1 * (r + 0.99 * best_next - Q[s, a])
    
    # At this rate, it'll walk by 2085
    return Q`
  }
];

// ─── BACKGROUND COMPONENTS ───────────────────────────────────────────────────

function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

function GlowOrb({ x, y, size, color }: { x: string; y: string; size: string; color: string }) {
  return (
    <div
      className="fixed rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: "blur(120px)", opacity: 0.12 }}
    />
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#080808]/90 backdrop-blur-2xl border-b border-white/[0.06]" : ""}`}
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="font-bold text-white text-xl tracking-tight">
          Saku<span className="text-neutral-600">Daku</span>
          <span className="text-neutral-700">05</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-neutral-500 text-sm">
          {[["#work", "Work"], ["#about", "About"], ["#skills", "Skills"], ["#contact", "Contact"]].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors duration-300 tracking-wide hover:tracking-widest">
              {label}
            </a>
          ))}
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm font-medium text-neutral-300 border border-white/10 bg-white/[0.05] backdrop-blur-sm px-4 py-2 rounded-full hover:border-white/25 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Talk to me!
        </Link>
      </div>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Big editorial text bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div
          className="text-[clamp(120px,20vw,280px)] font-black text-white/[0.02] leading-none tracking-tighter whitespace-nowrap"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          DEVELOPER
        </div>
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-[1152px] w-full mx-auto px-6 text-center">

        {/* Giant headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(48px,8vw,110px)] font-black text-white leading-[0.88] tracking-tighter mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          I Build Things
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-300 to-neutral-600">
            That Matter.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-xl md:text-2xl text-neutral-500 mb-14"
        >
          <FlipWords
            words={roles}
            className="text-white font-semibold !px-0"
            duration={3000}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#work" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            View Projects
          </a>
          <a
            href="https://github.com/SakuDaku05"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/15 text-white font-semibold rounded-full text-sm hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            GitHub ↗
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-neutral-700 text-[10px] uppercase tracking-[5px]">scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

function MarqueeStrip() {
  const items = [...skills, ...skills];
  return (
    <section className="py-6 border-y border-white/[0.06] overflow-hidden bg-white/[0.01]">
      <div className="flex">
        <div className="marquee-track">
          {items.map((s, i) => (
            <span key={i} className="flex items-center gap-5 px-5">
              <span className="text-neutral-500 text-xs uppercase tracking-[3px] whitespace-nowrap">{s}</span>
              <span className="text-neutral-800 text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DITHER HERO SECTION ─────────────────────────────────────────────────────

function DitherHeroSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden border-b border-white/[0.06]">
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-neutral-600 text-xs uppercase tracking-[4px] mb-6 block">Visual Aesthetic</span>
          <h2
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Art Meets<br />
            <span className="text-neutral-500">Engineering.</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed max-w-md">
            I believe the best software is both functional and beautiful. Inspired by the
            aesthetic philosophy of the great thinkers — clarity of thought reflected in clarity of design.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="w-8 h-px bg-white/20" />
            <span className="text-neutral-600 text-xs italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              "Simplicity is the ultimate sophistication" — Leonardo da Vinci
            </span>
          </div>
        </motion.div>

        {/* Dither shader visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />
            <DitherShader
              imageSrc="/profile.png"
              pixelSize={3}
              className="w-72 h-72 rounded-2xl relative z-10 border border-white/10"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 z-20">
              <div className="text-white text-sm font-bold">SakuDaku05</div>
              <div className="text-neutral-500 text-xs">Full Stack · AI Engineer</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="work" className="py-28 px-6 border-b border-white/[0.06]">
      <div className="max-w-[1280px] w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <span className="text-neutral-600 text-xs uppercase tracking-[4px]">Featured Work</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Selected
          <br />
          <span className="text-neutral-700">Projects.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-neutral-500 max-w-sm mb-20 text-sm"
        >
          Things I've built that I'm proud of. Real problems. Real solutions. Real code.
        </motion.p>
        <AnimatedTestimonials testimonials={projects} autoplay />
      </div>
    </section>
  );
}

// ─── QUOTE BLOCK ──────────────────────────────────────────────────────────────

function QuoteBlock({ q }: { q: { text: string; author: string } }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2 }}
      className="py-28 px-6 border-b border-white/[0.06]"
    >
      <div className="max-w-[768px] w-full mx-auto text-center">
        <div className="text-6xl text-white/10 mb-6 font-serif leading-none">"</div>
        <blockquote
          className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed italic mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {q.text}
        </blockquote>
        <cite className="not-italic text-neutral-600 text-xs uppercase tracking-[4px]">— {q.author}</cite>
      </div>
    </motion.section>
  );
}

// ─── PHILOSOPHY TEASER ────────────────────────────────────────────────────────

function PhilosophyTeaser({ q }: { q: { text: string; author: string } }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2 }}
      className="py-28 px-6 border-b border-white/[0.06]"
    >
      <div className="max-w-[768px] w-full mx-auto text-center">
        <div className="text-6xl text-white/10 mb-6 font-serif leading-none">"</div>
        <blockquote
          className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed italic mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {q.text}
        </blockquote>
        <cite className="not-italic text-neutral-600 text-xs uppercase tracking-[4px] block mb-16">— {q.author}</cite>
        
        <SlideToUnlock text="Slide to explore ideas" href="/philosophy" />
      </div>
    </motion.section>
  );
}

// ─── FAMOUS CODE TYPING ──────────────────────────────────────────────────────

function CodeTypingSection() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      const targetCode = codeSnippets[currentSnippetIndex].code;
      if (displayedCode.length < targetCode.length) {
        timeout = setTimeout(() => {
          setDisplayedCode(targetCode.slice(0, displayedCode.length + 1));
        }, Math.random() * 30 + 10); // typing speed
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000); // pause after typing
      }
    } else {
      if (displayedCode.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedCode(displayedCode.slice(0, -1));
        }, 10); // erasing speed
      } else {
        setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedCode, isTyping, currentSnippetIndex]);

  return (
    <section className="py-20 px-6 border-b border-white/[0.06]">
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-neutral-600 text-xs uppercase tracking-[4px] mb-6 block">Towards AGI</span>
          <h2
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Simulating<br />
            <span className="text-neutral-500">Intelligence.</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed max-w-md mb-8">
            A showcase of some algorithms I absolutely love. From basic gradients to attention mechanisms, here is a glimpse into the math that's teaching sand to think.
          </p>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs text-neutral-500 font-mono">Live Typing: {codeSnippets[currentSnippetIndex].name}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Mac OS Window Header */}
          <div className="flex items-center px-4 py-3 border-b border-white/[0.04] bg-[#0f0f0f]">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto text-xs text-neutral-500 font-mono">
              {codeSnippets[currentSnippetIndex].language}
            </div>
          </div>
          
          {/* Code Body */}
          <div className="p-6 h-[350px] overflow-hidden text-sm font-mono text-neutral-300 relative">
            <pre className="whitespace-pre-wrap break-all">
              <code>
                {displayedCode}
                <span className="inline-block w-2 h-4 bg-white/70 ml-1 animate-pulse align-middle" />
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── KEYBOARD SKILLS ─────────────────────────────────────────────────────────

function KeyboardSection() {
  return (
    <section id="skills" className="py-28 px-6 border-b border-white/[0.06]">
      <div className="max-w-[1280px] w-full mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-end">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-neutral-600 text-xs uppercase tracking-[4px] mb-6 block">Technology</span>
            <h2
              className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              My<br />
              <span className="text-neutral-700">Stack.</span>
            </h2>
            <p className="text-neutral-500 leading-relaxed max-w-sm text-sm">
              The highlighted keys? That's my daily driver. Everything else I pick up fast.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {skills.map((s) => (
              <span key={s} className="text-xs text-neutral-400 border border-white/[0.08] rounded-full px-4 py-1.5 hover:border-white/25 hover:text-white transition-all duration-300">
                {s}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Keyboard — full width, centered, scrollable on small screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full overflow-x-auto pb-2"
        >
          <div className="flex justify-center min-w-max mx-auto">
            <Keyboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-28 px-6 border-b border-white/[0.06]">
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative max-w-[420px]">
            <div className="absolute -inset-6 bg-gradient-to-br from-neutral-800/30 to-transparent rounded-3xl blur-2xl" />
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/profile.png"
                alt="SakuDaku05"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover grayscale contrast-125 brightness-90 hover:brightness-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white font-bold text-lg">SakuDaku05</div>
                <div className="text-neutral-400 text-sm mt-1">India · Available for Work</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              Open ✓
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-neutral-600 text-xs uppercase tracking-[4px] mb-6 block">About Me</span>
          <h2
            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-10 leading-[0.9]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Curious.<br />
            Relentless.<br />
            <span className="text-neutral-600">Builder.</span>
          </h2>
          <div className="space-y-5 text-neutral-400 text-sm leading-relaxed">
            <p>
              I'm SakuDaku05 — a developer who believes that the best code is like the best physics:
              elegant, minimal, and revealing of a deeper truth. Inspired by Feynman's curiosity,
              Tesla's vision, and Thiel's contrarianism.
            </p>
            <p>
              With 7+ public repositories on GitHub, I've shipped everything from AI-powered RAG pipelines
              to real-time analytics dashboards. I care about developer experience, performance, and
              building things that actually solve problems.
            </p>
            <p className="italic text-neutral-600 border-l border-white/10 pl-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              "What I cannot create, I do not understand." — Feynman
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="https://github.com/SakuDaku05"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/15 text-white text-sm rounded-full hover:bg-white/[0.08] transition-all duration-300"
            >
              GitHub ↗
            </a>
            <Link
              href="/chat"
              className="px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all duration-300"
            >
              Chat with Me!
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-40 px-6 text-center relative overflow-hidden">
      {/* Big background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[clamp(80px,15vw,200px)] font-black text-white/[0.015] whitespace-nowrap"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          CONTACT
        </span>
      </div>

      <div className="max-w-[896px] w-full mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <span className="text-neutral-600 text-xs uppercase tracking-[4px] mb-8 block">Get In Touch</span>
          <h2
            className="text-[clamp(60px,10vw,130px)] font-black text-white tracking-tighter leading-none mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Let's Build<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-700 via-white to-neutral-700">
              Something.
            </span>
          </h2>
          <p className="text-neutral-500 max-w-sm mx-auto text-sm mb-14 leading-relaxed">
            Have an idea? A problem to solve? Or just want to talk about code, philosophy, and everything in between?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:seemar978@gmail.com"
              className="px-10 py-5 bg-white text-black font-bold text-base rounded-full hover:bg-neutral-100 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              Send Email
            </a>
            <Link
              href="/chat"
              className="px-10 py-5 border border-white/20 text-white font-semibold text-base rounded-full hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
            >
              Chat with me →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-[1280px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-neutral-700 text-sm">© 2025 SakuDaku05. All rights reserved.</div>
        <div className="flex gap-6 text-neutral-500">
          <a href="https://github.com/SakuDaku05" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <IconBrandGithub className="w-5 h-5" />
          </a>
          <a href="https://twitter.com/SaketSingh57311" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <IconBrandTwitter className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/saket-singh-b86109318/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <IconBrandLinkedin className="w-5 h-5" />
          </a>
          <Link href="/chat" className="hover:text-white transition-colors text-sm font-medium ml-2 border-l border-white/10 pl-6">
            Let's Talk Na!
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-[#080808] text-white relative w-full overflow-hidden">
      <GridBackground />
      <GlowOrb x="-10%" y="10%" size="600px" color="radial-gradient(circle, #1a1a3e, transparent)" />
      <GlowOrb x="60%" y="40%" size="500px" color="radial-gradient(circle, #1a0a0a, transparent)" />
      <GlowOrb x="20%" y="80%" size="400px" color="radial-gradient(circle, #0a1a1a, transparent)" />

      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <DitherHeroSection />
      <QuoteBlock q={quotes[0]} />
      <ProjectsSection />
      <CodeTypingSection />
      <QuoteBlock q={quotes[1]} />
      <KeyboardSection />
      <QuoteBlock q={quotes[2]} />
      <AboutSection />
      <PhilosophyTeaser q={quotes[3]} />
      <ContactSection />
      <Footer />

      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm font-medium text-neutral-300 bg-neutral-900/90 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-xl hover:border-white/20 hover:text-white hover:bg-neutral-800/90 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Chat with me
        </Link>
      </div>
    </main>
  );
}
