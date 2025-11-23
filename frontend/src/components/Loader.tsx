'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime;
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Icosahedron args={[1, 0]} ref={ref} scale={1.2}>
         <MeshDistortMaterial 
            color="#4169E1" 
            emissive="#4169E1"
            emissiveIntensity={0.8}
            wireframe 
            speed={2} 
            distort={0.2} 
            transparent
            opacity={0.8}
         />
      </Icosahedron>
    </Float>
  );
}

export default function Loader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;

    // Variable speed loading simulation (Fast start -> Slow finish)
    let delay = 10; // Base fast speed
    
    if (progress < 40) {
        delay = 10; // Very fast
    } else if (progress < 70) {
        delay = 30; // Fast
    } else if (progress < 90) {
        delay = 60; // Moderate
    } else {
        delay = 150; // Slowing down
    }
    
    // Add slight randomness for realism
    delay += Math.random() * 10;

    const timer = setTimeout(() => {
      setProgress((prev) => {
        // Occasional jumps in the early phase
        const increment = (prev < 40 && Math.random() > 0.8) ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        onLoadingComplete();
      }, 800);
    }
  }, [progress, onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ pointerEvents: progress === 100 ? 'none' : 'auto' }}
    >
      {/* 3D Loading Object */}
      <div className="w-48 h-48 md:w-64 md:h-64 mb-2 relative">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#4169E1" />
          <LoadingSpinner />
        </Canvas>
        
        {/* Glow effect behind the 3D object */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-electric-blue/20 rounded-full blur-3xl -z-10" />
      </div>

      {/* Text Content */}
      <div className="text-center z-10 mb-8 md:mb-12 px-4">
        <motion.h2 
          className="text-lg md:text-2xl text-white font-bold tracking-[0.3em] mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {progress < 100 ? "SYSTEM LOADING..." : "ACCESS GRANTED"}
        </motion.h2>
        <p className="text-electric-blue text-xs md:text-sm tracking-widest font-mono">
           {progress < 30 ? "ANALYZING REQUIREMENTS" : 
            progress < 60 ? "ENGINEERING SOLUTIONS" : 
            progress < 90 ? "OPTIMIZING PERFORMANCE" : 
            "TURNING IDEAS INTO REALITY"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 md:w-96 relative px-4">
        <div className="flex justify-between items-end mb-2">
            <span className="text-dark-silver text-[10px] md:text-xs tracking-widest">SYSTEM CHECK</span>
            <span className="text-lg md:text-xl text-white font-mono font-bold">{progress}%</span>
        </div>
        <div className="w-full h-1 bg-gray-900/50 rounded-full overflow-hidden border border-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-electric-blue to-neon-purple box-shadow-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.02 }}
            style={{ boxShadow: '0 0 20px #4169E1' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
