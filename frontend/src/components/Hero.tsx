'use client';

import { motion, useInView } from 'framer-motion';
import Cube from './3d/Cube';
import { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Instagram, ChevronDown } from 'lucide-react';

const roles = ["MERN Stack Developer", "Backend Engineer", "Problem Solver"];

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, margin: "400px 0px" });
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const newOpacity = Math.max(0, 1 - window.scrollY / 100);
      setScrollOpacity(newOpacity);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    // CHANGED: min-h-[85vh] -> min-h-[90vh]
    // Adds slightly more height back to the mobile view (~5mm visual space)
    <section ref={ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gloss-black">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-gray-900 to-black opacity-80 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]" />

      {/* 3D Cube Background - Moved back to Right - Hidden on Mobile */}
      {!isMobile && (
        <div className="absolute inset-0 z-10 opacity-100 pointer-events-none">
          {/* 
             CRITICAL FIX: 
             - 'pointer-events-none': Touches pass through this div to the body (scrolling works).
             - 'md:pointer-events-auto': Mouse works on Desktop (spinning works).
             - Added 'touch-none' to ensure no touch actions are captured by children on mobile.
          */}
          <div className="absolute right-0 top-0 w-full h-full md:w-1/2 md:right-12 flex items-center justify-center pointer-events-none md:pointer-events-auto">
               <div className="w-full h-full"> 
                  {/* Always render, but pass the visibility state down */}
                  <Cube isInView={isInView} />
               </div>
          </div>
        </div>
      )}

      {/* Social Links Vertical - Top-Right on Mobile, Bottom-Right on Desktop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute top-6 right-4 md:top-auto md:bottom-8 md:right-6 z-30 flex flex-col items-center gap-6 pointer-events-auto"
      >
        <SocialLink href="https://github.com/Akhil-Kumar-2001" icon={<Github size={24} />} label="GitHub" />
        <SocialLink href="https://www.linkedin.com/in/akhil-kumar-s-9583762a1" icon={<Linkedin size={24} />} label="LinkedIn" />
        <SocialLink href="https://www.instagram.com/im.akhilkumar.s" icon={<Instagram size={24} />} label="Instagram" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center pointer-events-none">
        {/* Text Content - Moved back to Left */}
        <div className="w-full md:w-1/2 text-left md:pl-16 pointer-events-auto">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-metallic-silver font-light tracking-widest mb-2"
            >
              HELLO, I AM
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(65,105,225,0.5)]"
            >
              Akhil Kumar S
            </motion.h1>
            
            <div className="h-8 md:h-12 mb-6">
               <RoleRotator roles={roles} />
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-white text-lg md:text-xl max-w-lg leading-relaxed mb-8"
            >
              I build scalable applications and solve problems through efficient, thoughtful engineering.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex gap-4 flex-wrap"
            >
              <a href="#projects" className="px-6 py-3 md:px-8 border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black transition-all duration-300 uppercase tracking-wider text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(65,105,225,0.3)] hover:shadow-[0_0_25px_rgba(65,105,225,0.6)] whitespace-nowrap">
                View Work
              </a>
              <a href="#contact" className="px-6 py-3 md:px-8 border border-dark-silver text-metallic-silver hover:border-white hover:text-white transition-all duration-300 uppercase tracking-wider text-xs md:text-sm font-bold whitespace-nowrap">
                Contact Me
              </a>
            </motion.div>

            {/* NEW: Content Filler - Quote Block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="mt-12 border-l-2 border-electric-blue pl-4 py-2"
            >
               <p className="text-dark-silver italic text-sm md:text-base max-w-[300px]">
                 "It's not who I am underneath, but what I do that defines me."
               </p>
               <p className="text-xs text-metallic-silver mt-1 uppercase tracking-wider">
                 — Batman
               </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      // Intensified glow: doubled the spread and opacity to make it pop on small screens
      className="text-metallic-silver hover:text-electric-blue hover:scale-110 transition-all duration-300 filter drop-shadow-[0_0_15px_rgba(65,105,225,1)]"
    >
      {icon}
    </a>
  );
}

function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="relative overflow-hidden h-full">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple"
        >
          {roles[index]}
        </motion.div>
    </div>
  );
}
