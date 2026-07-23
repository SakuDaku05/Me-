import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white relative w-full overflow-hidden selection:bg-white/10">
      <div className="max-w-[768px] w-full mx-auto px-6 py-20 lg:py-32 relative z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-20 group text-sm uppercase tracking-[3px]">
          <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return
        </Link>

        <article className="prose prose-invert prose-neutral max-w-none">
          <h1 
            className="text-6xl md:text-8xl font-black mb-16 tracking-tighter"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Philosophy.
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-neutral-300 leading-relaxed italic mb-16 border-l-2 border-neutral-800 pl-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            "We suffer more often in imagination than in reality." — Seneca
          </p>
          
          <div className="space-y-8 text-neutral-400 font-light leading-relaxed text-lg">
            <p>
              I believe that writing good software is akin to building a physical tool. It must be honest. 
              It must do what it claims to do. It should feel robust, look elegant, and hide its internal complexities behind an intuitive surface.
            </p>
            
            <p>
              Technology often obscures reality. We build layers of abstraction until we forget what the machine is actually doing.
              My goal is to peel back those layers, to understand the raw materials, and to build systems that are as simple as possible—but no simpler.
            </p>
            
            <p>
              In a world obsessed with scale and disruption, I value durability and craft. I admire the watchmaker as much as the entrepreneur. 
            </p>

            <h2 className="text-3xl text-white mt-16 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              First Principles
            </h2>
            
            <ul className="list-none space-y-4">
              <li className="flex gap-4">
                <span className="text-neutral-600">—</span>
                <span><strong className="text-white font-medium">Clarity over cleverness:</strong> Code is read infinitely more times than it is written. Write it for the reader.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-neutral-600">—</span>
                <span><strong className="text-white font-medium">Form follows function:</strong> Aesthetics are not an afterthought; they are the natural result of an optimized system.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-neutral-600">—</span>
                <span><strong className="text-white font-medium">Skin in the game:</strong> Build things you actually want to use. Eat your own dog food.</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  );
}
