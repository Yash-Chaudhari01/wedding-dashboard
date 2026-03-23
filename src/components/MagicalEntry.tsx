"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MagicalEntry({ bride, groom }: { bride: string; groom: string }) {
  const [show, setShow] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [greeting, setGreeting] = useState("A beautiful day");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("A beautiful morning");
    else if (hour < 18) setGreeting("A beautiful afternoon");
    else setGreeting("A beautiful evening");

    // Give it a cinematic, slow fade
    const timer = setTimeout(() => setShow(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_47fccfa0e0.mp3" preload="auto" />
      
      {/* Floating Audio Toggle - Persists after entry */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-6 left-6 z-[100] bg-white/40 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-xl border border-white/50 text-primary-dark hover:bg-white/60 hover:scale-105 transition-all duration-500"
      >
        {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#fffdfc] flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              className="text-center max-w-2xl"
            >
              <p className="text-primary-dark/60 tracking-[0.4em] uppercase text-xs md:text-sm mb-8 font-medium">
                {greeting} to celebrate
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-script text-primary-dark mb-6 leading-relaxed">
                The Union Of
              </h1>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-primary-dark mt-6">
                {bride} <span className="font-script text-primary mx-4">&</span> {groom}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
