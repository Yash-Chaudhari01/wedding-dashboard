"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; top: number; left: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate static particle properties on client mount to avoid hydration mismatch
    const arr = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 5 + 3,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: ["100vh", "-10vh"],
            opacity: [0, 0.4, 0.6, 0],
            x: [0, (Math.random() - 0.5) * 100, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute rounded-full bg-primary/30 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
