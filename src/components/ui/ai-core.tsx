"use client";

import { motion } from "framer-motion";

export function AiCore({ isThinking = false }: { isThinking?: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48 mx-auto my-8">
      {/* Outer Tesla Coil Glow */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.2, 1] : 1,
          opacity: isThinking ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-[#1A73E8] blur-3xl opacity-20"
      />

      {/* Da Vinci Geometric Outer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full border border-dashed border-[#C5A880]/30 rounded-full flex items-center justify-center"
      >
        <div className="w-[115%] h-[115%] border border-[#C5A880]/20 rotate-45 absolute" />
        <div className="w-[115%] h-[115%] border border-[#C5A880]/20 rotate-[22.5deg] absolute" />
      </motion.div>

      {/* Middle Engineering Gear/Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[80%] h-[80%] border-2 border-[#8C6D46]/40 rounded-full"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-[49%] w-[2%] h-2 bg-[#8C6D46]/60"
            style={{ transform: `rotate(${i * 30}deg) translateY(-2px)`, transformOrigin: "50% 100%" }}
          />
        ))}
      </motion.div>

      {/* Inner Tesla Energy Core */}
      <motion.div
        animate={{
          scale: isThinking ? [0.8, 1, 0.8] : 0.9,
          boxShadow: isThinking
            ? [
                "0 0 20px #1A73E8, inset 0 0 20px #1A73E8",
                "0 0 40px #1A73E8, inset 0 0 40px #1A73E8",
                "0 0 20px #1A73E8, inset 0 0 20px #1A73E8",
              ]
            : "0 0 10px #1A73E8, inset 0 0 10px #1A73E8",
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-[40%] h-[40%] bg-black border border-[#1A73E8]/50 rounded-full flex items-center justify-center overflow-hidden"
      >
        {/* Core pupil */}
        <div className="w-2 h-2 bg-[#1A73E8] rounded-full shadow-[0_0_10px_#1A73E8]" />
      </motion.div>

      {/* Crosshairs */}
      <div className="absolute w-[140%] h-[1px] bg-[#C5A880]/20" />
      <div className="absolute h-[140%] w-[1px] bg-[#C5A880]/20" />
    </div>
  );
}
