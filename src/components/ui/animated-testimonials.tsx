"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  repoUrl?: string;
};

// Deterministic rotations — no Math.random() to avoid SSR hydration mismatch
const ROTATIONS = [-6, 4, -3, 8, -5, 3, -8, 5, -2, 7];
const getRotation = (index: number) => ROTATIONS[index % ROTATIONS.length];

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  if (!mounted) {
    // Render a stable skeleton on server / before hydration
    return (
      <div className="max-w-[384px] w-full md:max-w-[896px] w-full mx-auto px-4 md:px-8 lg:px-12 py-20">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative h-80 w-full bg-neutral-900 rounded-3xl border border-neutral-800" />
          <div className="flex flex-col gap-4 py-4">
            <div className="h-8 w-2/3 bg-neutral-800 rounded-lg" />
            <div className="h-4 w-1/2 bg-neutral-900 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[384px] w-full md:max-w-[896px] w-full mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Card stack */}
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: getRotation(index + 1),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : getRotation(index),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -60, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: getRotation(index + 2),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-[0_0_50px_rgba(255,255,255,0.06)] border border-neutral-800"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-6 justify-center md:justify-start">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  isActive(idx) ? "bg-white w-8" : "bg-neutral-700 w-4"
                )}
              />
            ))}
          </div>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-between py-4 h-full min-h-80">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Project number */}
            <div className="text-xs text-neutral-600 uppercase tracking-[4px] mb-4">
              {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {testimonials[active].name}
            </h3>
            <p className="text-xs text-neutral-500 mb-8 uppercase tracking-[3px] border-l-2 border-neutral-800 pl-3">
              {testimonials[active].designation}
            </p>
            <motion.p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation */}
          <div className="flex gap-3 pt-10 md:pt-6">
            <button
              onClick={handlePrev}
              className="h-11 w-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
              aria-label="Previous project"
            >
              <IconArrowLeft className="h-5 w-5 text-neutral-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-11 w-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
              aria-label="Next project"
            >
              <IconArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
            </button>
            {testimonials[active].repoUrl && (
              <a 
                href={testimonials[active].repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="ml-auto flex items-center gap-2 px-4 h-11 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all duration-300"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
