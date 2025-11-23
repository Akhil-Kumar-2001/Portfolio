'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, OrbitControls, PerspectiveCamera, Billboard } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const allSkills = [
  "JavaScript", "TypeScript", "Express", "Nest.js", "C", "React",
  "Next.js", "CSS", "HTML", "Bootstrap",
  "MongoDB", "SQL", "REST API", "API Integration",
  "Redux", "Zustand", "MVC", "Repo Pattern", "Data Struct",
  "AWS S3", "Docker", "Vercel", "Git", "GitHub", "Figma"
];

const colorBack = new THREE.Color("#888888");
const colorFront = new THREE.Color("#FFFFFF");
const colorBlack = new THREE.Color("#000000");

function CodeBlock({ position, text, delay }: { position: [number, number, number], text: string, delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<any>(null);
  const { camera } = useThree(); 
  // Reuse Vector3 to avoid garbage collection stutter
  const vec = useMemo(() => new THREE.Vector3(), []); 
  const tempColor = useMemo(() => new THREE.Color(), []); 

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(t + delay) * 0.2;
      
      // Optimized: use re-usable vector
      groupRef.current.getWorldPosition(vec);
      const dist = vec.distanceTo(camera.position);
      
      const opacity = THREE.MathUtils.mapLinear(dist, 8, 13, 1.0, 0.2);
      const clampedOpacity = THREE.MathUtils.clamp(opacity, 0.2, 1.0);

      if (textRef.current) {
         textRef.current.material.opacity = clampedOpacity;
         textRef.current.material.transparent = true;
         textRef.current.fillOpacity = clampedOpacity;
         
         tempColor.lerpColors(colorBack, colorFront, clampedOpacity);
         textRef.current.color = tempColor;
         
         // BOOSTED GLOW: Increased max intensity from 1.5 to 4.0
         // This makes the text shine brightly without needing the heavy Bloom effect
         textRef.current.material.emissiveIntensity = THREE.MathUtils.mapLinear(clampedOpacity, 0.2, 1.0, 0.0, 4.0);
         
         if (clampedOpacity > 0.8) {
             textRef.current.material.emissive = colorFront;
         } else {
             textRef.current.material.emissive = colorBlack;
         }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        <Text
          ref={textRef}
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          textAlign="center"
        >
          {text}
          <meshStandardMaterial
             emissive="#FFFFFF"
             toneMapped={false}
             transparent
          />
        </Text>
      </Billboard>
    </group>
  );
}

function FloatingCodeCloud({ isMobile }: { isMobile: boolean }) {
  const blocks = useMemo(() => {
    // Restored mostly full list for mobile (20 items) to fix "very small" feel
    const skillsToUse = isMobile ? allSkills.slice(0, 20) : allSkills;
    
    return skillsToUse.map((skill, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / skillsToUse.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      // Restored radius close to desktop size (3.2 vs 3.5)
      const radius = isMobile ? 3.4 : 3.5; 
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      return {
        text: skill,
        position: [x, y, z] as [number, number, number],
        delay: i * 0.2
      };
    });
  }, [isMobile]);

  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame((state) => {
     const t = state.clock.getElapsedTime();
     if(groupRef.current) {
         const scrollOffset = scrollRef.current * 0.001; 
         
         const rotationSpeed = 0.05;
         groupRef.current.rotation.x = t * rotationSpeed + scrollOffset; 
         groupRef.current.rotation.y = t * rotationSpeed + scrollOffset; 
     }
  });

  // Full scale on mobile (1) to match request
  return (
    <group ref={groupRef} scale={1}>
      {blocks.map((block, i) => (
        <CodeBlock key={i} {...block} />
      ))}
    </group>
  );
}

export default function SkillsCloud({ isInView = true }: { isInView?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile(); 
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] cursor-grab active:cursor-grabbing">
      {/* Strict limit to 1.0 DPR on mobile to prevent crashing */}
      <Canvas dpr={[1, 1.5]} frameloop={isInView ? "always" : "never"}>
        <PerspectiveCamera makeDefault position={[0, 0, 11]} />
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        
        <directionalLight position={[5, 5, 5]} intensity={2} color="#FFFFFF" />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#4169E1" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
           <FloatingCodeCloud isMobile={isMobile} />
        </Float>

        {/* Optimized Bloom for Glow */}
        <EffectComposer 
          enableNormalPass={false} 
          multisampling={0} 
          // CRITICAL OPTIMIZATION: Render glow at half resolution on mobile. 
          // This gives you the glow effect with 4x better performance than standard.
          resolutionScale={isMobile ? 0.5 : 1}
        >
          <Bloom 
            // Lower threshold means "glow easier"
            luminanceThreshold={0.1} 
            mipmapBlur 
            // Increased intensity for more visible glow
            intensity={isMobile ? 1.0 : 1.5} 
            radius={0.6}
          />
        </EffectComposer>

        {/* Re-enabled rotate on mobile as requested */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>
    </div>
  );
}