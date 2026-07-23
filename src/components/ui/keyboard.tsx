"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type KeyboardKey = {
  label: string;
  width?: "1x" | "1.5x" | "2x" | "2.5x" | "3x" | "4x" | "5x" | "6x" | "7x";
  highlight?: boolean;
  icon?: string;
};

const keys: KeyboardKey[][] = [
  [
    { label: "esc", width: "1x" },
    { label: "F1" }, { label: "F2" }, { label: "F3" }, { label: "F4" },
    { label: "F5" }, { label: "F6" }, { label: "F7" }, { label: "F8" },
    { label: "F9" }, { label: "F10" }, { label: "F11" }, { label: "F12" },
  ],
  [
    { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" },
    { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" },
    { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" },
    { label: "=" }, { label: "delete", width: "2x" },
  ],
  [
    { label: "tab", width: "1.5x" }, { label: "Q", highlight: true },
    { label: "W", highlight: true }, { label: "E", highlight: true },
    { label: "R", highlight: true }, { label: "T" }, { label: "Y" },
    { label: "U", highlight: true }, { label: "I" }, { label: "O" },
    { label: "P" }, { label: "[" }, { label: "]" }, { label: "\\", width: "1.5x" },
  ],
  [
    { label: "caps", width: "1.5x" }, { label: "A", highlight: true },
    { label: "S", highlight: true }, { label: "D", highlight: true },
    { label: "F", highlight: true }, { label: "G" }, { label: "H" },
    { label: "J", highlight: true }, { label: "K" }, { label: "L" },
    { label: ";" }, { label: "'" }, { label: "return", width: "2.5x" },
  ],
  [
    { label: "shift", width: "2x" }, { label: "Z" }, { label: "X" },
    { label: "C", highlight: true }, { label: "V", highlight: true },
    { label: "B" }, { label: "N" }, { label: "M" }, { label: "," },
    { label: "." }, { label: "/" }, { label: "shift", width: "3x" },
  ],
  [
    { label: "fn" }, { label: "ctrl" }, { label: "opt" },
    { label: "⌘", width: "1.5x" },
    { label: "", width: "7x" },
    { label: "⌘", width: "1.5x" }, { label: "opt" },
    { label: "◀" }, { label: "▲" }, { label: "▼" }, { label: "▶" },
  ],
];

const widthMap: Record<string, string> = {
  "1x": "w-10",
  "1.5x": "w-14",
  "2x": "w-20",
  "2.5x": "w-24",
  "3x": "w-28",
  "4x": "w-36",
  "5x": "w-44",
  "6x": "w-52",
  "7x": "w-64",
};

function Key({ keyData, delay = 0 }: { keyData: KeyboardKey; delay?: number }) {
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Simulate mechanical switch thock/click
      osc.type = "square";
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio context errors (e.g. if user hasn't interacted yet)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ y: 2, scale: 0.95, boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.6)" }}
      onPointerDown={playClickSound}
      className={cn(
        "h-10 rounded-md flex items-center justify-center cursor-default select-none",
        "text-xs font-mono font-semibold transition-all duration-150",
        "border shadow-[0_4px_0px_0px_rgba(0,0,0,0.6)]",
        "hover:shadow-[0_2px_0px_0px_rgba(0,0,0,0.6)] hover:translate-y-[2px]",
        widthMap[keyData.width || "1x"] || "w-10",
        keyData.highlight
          ? "bg-white text-black border-white/50 shadow-[0_4px_0px_0px_rgba(255,255,255,0.1)]"
          : "bg-neutral-900 text-neutral-400 border-white/5"
      )}
    >
      {keyData.label}
    </motion.div>
  );
}

export function Keyboard({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-4 bg-black/50 rounded-2xl border border-white/10 backdrop-blur-sm w-fit", className)}>
      {keys.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {row.map((key, keyIdx) => (
            <Key
              key={`${rowIdx}-${keyIdx}`}
              keyData={key}
              delay={rowIdx * 0.05 + keyIdx * 0.02}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
