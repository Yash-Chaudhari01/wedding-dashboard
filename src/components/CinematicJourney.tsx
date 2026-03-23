"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Volume2, VolumeX, Heart } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

const NavigationMap = dynamic(() => import("./NavigationMap"), { ssr: false });

export default function CinematicJourney({ bride, groom, venueLat, venueLng, venueName }: any) {
  const [stage, setStage] = useState(1);
  const [journeyActive, setJourneyActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (journeyActive) return;
    const timers = [
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 5000),
      setTimeout(() => setStage(4), 8000),
      setTimeout(() => setStage(5), 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [journeyActive]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const beginJourney = () => {
    setJourneyActive(true);
    if (!isPlaying && audioRef.current) {
        audioRef.current.play().catch(()=>console.log("Audio play blocked by browser"));
        setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] text-white selection:bg-white/20 font-sans">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_47fccfa0e0.mp3" />

      {/* Audio Toggle Top Right Layer */}
      <button onClick={toggleAudio} className="absolute top-8 right-8 z-[9999] text-white/50 hover:text-white transition-colors p-4 backdrop-blur-md rounded-full bg-white/5 border border-white/10 shadow-lg">
        {isPlaying ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
      </button>

      {/* Cinematic Intro Layer */}
      <AnimatePresence>
        {!journeyActive && (
          <motion.div 
            exit={{ opacity: 0, filter: "blur(30px)", scale: 1.15 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]"
          >
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.p key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 1.5, ease: "easeOut" }} className="text-xl md:text-3xl tracking-[0.3em] text-white/70 uppercase font-light text-center px-4">
                  Two souls... one journey
                </motion.p>
              )}
              {stage === 2 && (
                <motion.p key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 1.5, ease: "easeOut" }} className="text-xl md:text-3xl tracking-[0.2em] text-white/90 font-light text-center px-4">
                  And you are invited to be a part of it
                </motion.p>
              )}
              {stage >= 3 && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {stage >= 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 3.5 }} className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }} />
                  )}
                  
                  {stage >= 4 && <div className="absolute inset-0 z-0"><FloatingParticles /></div>}

                  <div className="relative z-10 text-center flex flex-col items-center px-6">
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-heading text-[#E6D4B8] drop-shadow-2xl leading-none">
                      {bride} 
                    </h1>
                    <span className="font-script text-[#CBAEAE] text-5xl md:text-8xl my-2 block">
                      & 
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-heading text-[#E6D4B8] drop-shadow-2xl leading-none">
                       {groom}
                    </h1>
                  </div>

                  {stage >= 5 && (
                    <motion.button 
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.8 }}
                      onClick={beginJourney}
                      className="mt-12 pointer-events-auto px-10 py-5 bg-white/5 hover:bg-white/15 backdrop-blur-xl border border-[#E6D4B8]/30 text-[#E6D4B8] rounded-[2rem] tracking-[0.2em] uppercase text-sm md:text-base font-light hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(230,212,184,0.1)] flex items-center group"
                    >
                      <Heart className="w-5 h-5 mr-3 text-[#CBAEAE] group-hover:fill-[#CBAEAE] transition-all duration-500" />
                      Begin Your Journey
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Deep Interactive Map Layer */}
      {journeyActive && (
         <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
           className="absolute inset-0 z-10"
         >
            <NavigationMap venueLat={venueLat} venueLng={venueLng} venueName={venueName} />
         </motion.div>
      )}
    </div>
  );
}
