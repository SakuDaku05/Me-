"use client";
import { useState, useRef, useEffect } from "react";
import { IconPlayerPlay, IconPlayerPause, IconVolume } from "@tabler/icons-react";
import { motion } from "framer-motion";

export function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Many browsers block autoplay, so we only play on explicit user click
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Sync state if audio ends or pauses externally
    const audio = audioRef.current;
    if (!audio) return;
    
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3">
      {/* 
        We use a royalty-free lofi track placeholder. 
        For best performance, replace this URL with a local file like "/lofi.mp3" in your public folder.
        preload="none" ensures it doesn't slow down the initial page load.
      */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
        loop
        preload="none"
      />
      
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-xl hover:bg-neutral-800/90 hover:border-white/20 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.6)] group"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <IconPlayerPause className="w-5 h-5 text-neutral-300 group-hover:text-white" fill="currentColor" />
        ) : (
          <IconPlayerPlay className="w-5 h-5 text-neutral-300 group-hover:text-white translate-x-[1px]" fill="currentColor" />
        )}
      </button>

      {/* Equalizer animation when playing */}
      {isPlaying && (
        <div className="flex items-end gap-[3px] h-4 px-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-emerald-500/80 rounded-full"
              animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
