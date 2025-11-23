'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, TorusKnot, OrbitControls, Float, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Normalize scroll position for better rotation mapping
      scrollRef.current = window.scrollY;
    };
    
    // Add listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Base continuous animation
      const t = state.clock.getElapsedTime();
      
      // Scroll influence (divided by window height to make it responsive)
      const scrollRotation = scrollRef.current * 0.002;
      
      // Combine both: It spins slowly on its own, but scroll drives it faster
      meshRef.current.rotation.x = t * 0.2 + scrollRotation;
      meshRef.current.rotation.y = t * 0.3 + scrollRotation * 0.5;
    }
  });

  return (
    <TorusKnot args={[1, 0.35, 100, 32]} ref={meshRef} scale={1.4}>
      <MeshDistortMaterial
        color="#000000"
        attach="material"
        distort={0.4}
        speed={2}
        metalness={1}
        roughness={0} // Mirror-like finish
        emissive="#111111"
        emissiveIntensity={0.2}
      />
      {/* Glowing Wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.TorusKnotGeometry(1, 0.35, 100, 32)]} />
        <lineBasicMaterial color="#4169E1" linewidth={2} opacity={0.5} transparent />
      </lineSegments>
    </TorusKnot>
  );
}

export default function CyberShape() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas>
        <ambientLight intensity={0.5} />
        
        {/* Realistic Reflections */}
        <Environment preset="city" />

        <directionalLight position={[2, 5, 2]} intensity={1} color="#C0C0C0" />
        <pointLight position={[-2, -2, 2]} color="#6A5ACD" intensity={2} />
        
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
           <AnimatedShape />
        </Float>

        {/* Post-processing for Glow - Optimized */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={0.8} 
            radius={0.5}
          />
        </EffectComposer>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
