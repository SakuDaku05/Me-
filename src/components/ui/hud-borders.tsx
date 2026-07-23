"use client";

export function HudBorders({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full border-[1px] border-[#C5A880]/10 p-2 md:p-6 bg-[#0a0a0a] overflow-hidden">
      {/* Da Vinci Paper Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #C5A880 1px, transparent 1px), linear-gradient(to bottom, #C5A880 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Tesla Electric Arcs (Subtle Corner Glows) */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#1A73E8] blur-[100px] opacity-10 rounded-full" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#1A73E8] blur-[100px] opacity-10 rounded-full" />
      
      {/* Golden Ratio Corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C5A880]/40 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C5A880]/40 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C5A880]/40 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C5A880]/40 rounded-br-3xl" />

      {/* Measurement Markers */}
      <div className="absolute top-[10%] left-0 w-2 h-px bg-[#C5A880]/30" />
      <div className="absolute top-[20%] left-0 w-4 h-px bg-[#C5A880]/40" />
      <div className="absolute top-[30%] left-0 w-2 h-px bg-[#C5A880]/30" />

      {/* Blueprint Annotations */}
      <div className="absolute top-2 right-6 text-[10px] text-[#C5A880]/50 font-mono tracking-widest uppercase">
        FIG. 1 — TESLA/VINCI
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
