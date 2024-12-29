"use client"

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface ModelProps {
  scrollProgress: number;
}

// Model component that handles the 3D object
const Model: React.FC<ModelProps> = ({ scrollProgress }) => {
  const modelRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF('/assets/model2.glb');

  useFrame(() => {
    if (modelRef.current) {
      // Rotate the model 90 degrees around the X-axis to make it upright
      modelRef.current.rotation.x = Math.PI / 2;
  
      // Rotate based on scroll progress (0 to 1), rotating around the Z-axis
      // Limit the rotation to 180 degrees (π radians)
      const rotationAmount = scrollProgress * Math.PI; // 0 to π radians (180 degrees)
      // const rotationAmount = Math.min(scrollProgress, 1.5) * Math.PI * 2; // Stop at 180 degrees (π radians)
      modelRef.current.rotation.z = rotationAmount;
  
      // Scale/zoom based on scroll progress (0 to 1), ensuring it starts and ends at 1
      // The scale can go from 1 to a maximum of 2 (or more) and then back to 1
      const scale = 3 + scrollProgress * 2; // Scale will range from 1 to 2
      modelRef.current.scale.setScalar(scale);
    }
  });
  return (
    <mesh ref={modelRef as any} position={[0, scrollProgress * -3, 0]}>
      <primitive object={scene} />
    </mesh>
  );
};

// Main component wrapper
const ScrollAnimated3DScene: React.FC = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const totalScroll = (document.documentElement.scrollHeight - window.innerHeight) / 1.5;
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / totalScroll, 1) * 2;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ 
          position: [0, 0, 10],
          fov: 75,
          // fov: 55 + scrollProgress * 20,
          near: 0.1,
          far: 1000
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default ScrollAnimated3DScene;