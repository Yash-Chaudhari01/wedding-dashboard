"use client";

import { motion, Variants } from "framer-motion";

export default function WelcomeHero({ bride, groom }: { bride: string, groom: string }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 3.5 } // waits for MagicalEntry to finish fading out
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" }}
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image masked under gradient */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-4 mt-12"
      >
        <motion.p variants={item} className="text-accent uppercase tracking-[0.3em] text-sm md:text-base mb-8 font-medium">
          We Are Getting Married
        </motion.p>
        
        <motion.h1 variants={item} className="text-6xl md:text-8xl lg:text-9xl font-heading text-primary-dark mb-2 drop-shadow-sm">
          {bride}
        </motion.h1>
        
        <motion.div variants={item} className="text-5xl md:text-7xl font-script text-primary my-4">
          &
        </motion.div>
        
        <motion.h1 variants={item} className="text-6xl md:text-8xl lg:text-9xl font-heading text-primary-dark mb-10 drop-shadow-sm">
          {groom}
        </motion.h1>
        
        <motion.div variants={item} className="w-24 h-[1px] bg-primary/50 mx-auto my-12" />
      </motion.div>
    </section>
  );
}
