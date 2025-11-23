'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import CyberShape from './3d/CyberShape';

export default function About() {
  return (
    // CHANGED: py-12 -> py-16
    // Adds a bit more padding to the top of About section
    <section id="about" className="py-16 md:py-20 relative bg-black overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left: 3D Render - Hidden on small screens */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex w-full md:w-1/2 justify-center"
        >
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 blur-3xl rounded-full" />
            <CyberShape />
          </div>
        </motion.div>

        {/* Right: About Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-4xl font-bold mb-8 text-white relative inline-block">
            ABOUT ME
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-transparent" />
          </h2>
          
          <div className="space-y-6 text-dark-silver text-lg leading-relaxed">
            <p>
              I'm a self-taught <span className="text-white font-semibold">MERN Stack Developer</span> coming from a completely different background.
            </p>
            <p>
              I worked as a lift technician with no IT experience. My curiosity for solving real-life problems pushed me into software development.
            </p>
            <p>
              Now, I build full-stack solutions with clean architecture and modern tools. I specialize in creating robust backend systems with <span className="text-electric-blue">Node.js</span>, <span className="text-electric-blue">Express</span>, & <span className="text-electric-blue">NestJS</span>, and interactive frontends with <span className="text-electric-blue">React</span> & <span className="text-electric-blue">Next.js</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

