'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function SubCube({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <mesh 
      position={position} 
      scale={[scale, scale, scale]}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial
        color="#000000"
        metalness={1}
        roughness={0.1}
        emissive="#111111"
        emissiveIntensity={0.2}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.95, 0.95, 0.95)]} />
        <lineBasicMaterial color="#C0C0C0" linewidth={2} opacity={0.8} transparent />
      </lineSegments>
    </mesh>
  );
}

function IrregularRubiksCube({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base constant rotation
      const baseRotation = delta * 0.1;
      
      // Scroll influence (direct absolute rotation instead of additive acceleration)
      // This makes it "move" with the scroll
      const scrollRotation = scrollRef.current * 0.002;
      
      groupRef.current.rotation.x += baseRotation; // Keep X spinning constantly
      groupRef.current.rotation.y = scrollRotation + (state.clock.getElapsedTime() * 0.2); // Y axis driven directly by scroll position + time
    }
  });

  const cubes = useMemo(() => {
    const temp = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Irregularity: Random subtle scale variation
          const scale = 0.9 + Math.random() * 0.1;
          temp.push({ x, y, z, scale });
        }
      }
    }
    return temp;
  }, []);

  return (
    <group ref={groupRef} scale={isMobile ? 0.65 : 1}>
      {cubes.map((c, i) => (
        <SubCube key={i} position={[c.x * 1.05, c.y * 1.05, c.z * 1.05]} scale={c.scale} />
      ))}
    </group>
  );
}

export default function Cube() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile(); // Initial check
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      {/* Optimized DPR for mobile performance - Lower cap prevents stuttering */}
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.2} />
        
        {/* Realistic Reflections */}
        <Environment preset="city" />
        
        {/* Lighting */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#C0C0C0" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4169E1" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#6A5ACD" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <IrregularRubiksCube isMobile={isMobile} />
        </Float>
        
        {/* Post-processing for Glow - Disabled on mobile for performance */}
        {!isMobile && (
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={1.5} 
              radius={0.4}
            />
          </EffectComposer>
        )}
        
        {/* 
           CRITICAL FIX: 
           - enabled={!isMobile}: COMPLETELY DISABLES controls on mobile. 
           - This ensures the canvas acts like a static image/video and doesn't block scrolling.
        */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false} 
          enableRotate={!isMobile}
          enabled={!isMobile} 
        />
      </Canvas>
    </div>
  );
}