'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/Loader';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-electric-blue selection:text-white">
      <AnimatePresence>
        {loading && <Loader onLoadingComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }} // Slower fade-in for dramatic effect
        >
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </main>
  );
}
