'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import SkillsCloud from './3d/SkillsCloud';
import { useRef } from 'react';

const allSkills = [
  "JavaScript", "TypeScript", "Express", "Nest.js", "C", "React",
  "Next.js", "CSS", "HTML", "Bootstrap",
  "MongoDB", "SQL", "REST API", "API Integration",
  "Redux", "Zustand", "MVC", "Repository Pattern", "Data Structures",
  "AWS S3", "Docker", "Vercel", "Git", "GitHub", "Figma"
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, margin: "600px 0px" }); // Preload heavily

  return (
    <section id="skills" ref={ref} className="py-20 bg-black relative overflow-hidden">
       {/* Background glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-blue/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16 md:mb-20 text-center text-white"
        >
          TECHNICAL ARSENAL
        </motion.h2>

        {/* Added padding-left to shift content slightly right */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full pl-0 md:pl-12">
           {/* Description - Left Side */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="w-full md:w-1/3 flex flex-col justify-center items-center text-center order-2 md:order-1"
           >
              <p className="text-dark-silver text-lg leading-relaxed mb-6">
                My technical expertise spans the entire development lifecycle. I build robust, scalable applications using a modern stack centered around <span className="text-white">JavaScript</span> and <span className="text-white">TypeScript</span>.
              </p>
              <p className="text-dark-silver text-lg leading-relaxed mb-6">
                From crafting interactive frontends with <span className="text-electric-blue">React</span> and <span className="text-electric-blue">Next.js</span> to engineering high-performance backends with <span className="text-electric-blue">Node.js</span>, <span className="text-electric-blue">Express</span>, and <span className="text-electric-blue">NestJS</span>, I deliver end-to-end solutions.
              </p>
              <p className="text-dark-silver text-lg leading-relaxed">
                I also have experience with cloud infrastructure (AWS), containerization (Docker), and database management (MongoDB, SQL).
              </p>
           </motion.div>

           {/* 3D Cloud - Right Side */}
           <div className="w-full md:w-2/3 h-[500px] order-1 md:order-2 flex items-center justify-center translate-x-0 md:translate-x-8">
              {/* Always render, but pass the visibility state down */}
              <SkillsCloud isInView={isInView} />
           </div>
        </div>
      </div>
    </section>
  );
}
