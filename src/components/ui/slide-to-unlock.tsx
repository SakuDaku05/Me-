"use client";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { IconChevronRight } from "@tabler/icons-react";

export function SlideToUnlock({
  text = "slide to read",
  href = "/philosophy",
}: {
  text?: string;
  href?: string;
}) {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const textOpacity = useTransform(x, [0, 150], [1, 0]);

  // Pre-fetch the route for instant transition
  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  const handleDragEnd = (event: any, info: any) => {
    if (!containerRef.current) return;
    // Thumb is w-16 (64px), padding is 8px left/right. 
    // Container width minus thumb width is max travel distance.
    const maxTravel = containerRef.current.offsetWidth - 64 - 16;
    
    if (info.offset.x >= maxTravel * 0.8) {
      // Unlocked
      setIsUnlocked(true);
      controls.start({ x: maxTravel, transition: { duration: 0.2 } });
      
      // Play a mechanical unlocking click
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch(e) {}

      // Navigate
      setTimeout(() => {
        router.push(href);
      }, 300);
      
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm h-16 rounded-full bg-[#111] border border-white/10 flex items-center px-2 overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] mx-auto"
    >
      {/* Shimmering Text Background */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span 
          className="text-transparent bg-clip-text font-bold uppercase tracking-[4px] text-xs"
          style={{
            backgroundImage: "linear-gradient(to right, #444 0%, #fff 50%, #444 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 2.5s linear infinite"
          }}
        >
          {text}
        </span>
      </motion.div>

      {/* Draggable Thumb */}
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="h-12 w-16 bg-gradient-to-b from-neutral-200 to-neutral-400 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] z-10"
      >
        <IconChevronRight className="text-black/70 h-6 w-6" stroke={3} />
      </motion.div>
      
      {/* Provide shimmering keyframes inline for simplicity */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}} />
    </div>
  );
}
