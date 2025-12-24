'use client';

import { motion, useMotionValue, PanInfo } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface Project {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  githubSecondary?: string; // For separate client/server repos
  live?: string;
  image?: string; 
}

const projects: Project[] = [
  {
    title: "SipSavvy",
    description: "Liquor eCommerce web app with cart, orders, and payments.",
    stack: ["Node.js", "Express", "MongoDB", "EJS"],
    github: "https://github.com/Akhil-Kumar-2001/Sip-Savvy",
    image: "/projects/sipsavvy.png"
  },
  {
    title: "Elevio",
    description: "E-Learning Platform with real-time video chat and messaging.",
    stack: ["MERN", "Next.js", "WebRTC", "Socket.io"],
    github: "https://github.com/Akhil-Kumar-2001/Elevio_Client",
    githubSecondary: "https://github.com/Akhil-Kumar-2001/Elevio_Server",
    image: "/projects/elevio.png"
  },
  {
    title: "EventAura",
    description: "Event management system with Razorpay payment integration.",
    stack: ["MERN Stack", "Razorpay"],
    github: "https://github.com/Akhil-Kumar-2001/Event-Aura",
    image: "/projects/eventaura.png"
  }
];

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // Minimum drag distance to trigger swipe
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x < 0 && currentIndex < projects.length - 1) {
        // Swiped left (negative) = go to next
        setCurrentIndex(currentIndex + 1);
      } else if (info.offset.x > 0 && currentIndex > 0) {
        // Swiped right (positive) = go to previous
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    // Reset position
    x.set(0);
  };

  // Calculate card width and transform for mobile
  const cardWidth = typeof window !== 'undefined' && isMobile ? window.innerWidth - 48 : 0;
  const transform = -currentIndex * (cardWidth + 40); // 40px gap

  return (
    <section id="projects" className="py-32 bg-black relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-900/30 via-black to-black pointer-events-none" />
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-metallic-silver/20 to-transparent" />
       
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
            FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallic-silver to-white">PROJECTS</span>
          </h2>
          <div className="h-1 w-24 bg-electric-blue mx-auto rounded-full shadow-[0_0_10px_rgba(65,105,225,0.6)]" />
        </motion.div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        {/* Mobile: Swipeable Carousel */}
        <div className="md:hidden relative overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-10 cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ 
              left: isMobile ? -(projects.length - 1) * (cardWidth + 40) : 0, 
              right: 0 
            }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={{ x: isMobile ? transform : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {projects.map((project, index) => (
              <div key={index} className="flex-shrink-0 w-[calc(100vw-3rem)]">
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </motion.div>
          
          {/* Swipe Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-electric-blue shadow-[0_0_10px_rgba(65,105,225,0.6)]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
           <a 
             href="https://github.com/Akhil-Kumar-2001" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-sm text-metallic-silver hover:bg-white/10 hover:border-electric-blue hover:text-white transition-all duration-300 rounded-full group"
           >
             <span>View All Projects</span>
             <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
           </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Removed complex scroll-linked parallax to fix "stuck" scrolling issue.
  // Reverting to simpler Framer Motion viewport animation.
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
    >
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
         {project.image ? (
           <Image
             src={project.image}
             alt={project.title}
             fill
             className="object-cover transition-transform duration-700 group-hover:scale-110"
           />
         ) : (
           <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm">NO PREVIEW</div>
         )}
         {/* Overlay gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-8 relative">
        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-electric-blue transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.stack.map((tech) => (
            <span key={tech} className="px-3 py-1 text-[11px] uppercase tracking-wider font-medium text-gray-400 bg-white/5 rounded-full">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 pt-6 border-t border-white/5 mt-auto">
           {project.github && (
             <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link">
               <Github size={18} />
               <span className="relative">
                 Code
                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover/link:w-full" />
               </span>
             </a>
           )}
           {project.githubSecondary && (
             <a href={project.githubSecondary} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link">
               <Github size={18} />
               <span className="relative">
                 Server
                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover/link:w-full" />
               </span>
             </a>
           )}
           {project.live && (
             <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link">
               <ExternalLink size={18} />
               <span className="relative">
                 Live Demo
                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover/link:w-full" />
               </span>
             </a>
           )}
        </div>
      </div>
    </motion.div>
  );
}