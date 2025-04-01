import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Float, 
  AdaptiveDpr,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { useThemeStore } from '../lib/stores/useThemeStore';
import FloatingParticles from './scene/FloatingParticles';

// A shape that floats and rotates slowly
const FloatingShape = ({ position = [0, 0, 0], color = '#64FFDA', size = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position as [number, number, number]}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.5}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

// Background scene setup
const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const theme = useThemeStore(state => state.theme);
  const { gl } = useThree();
  
  // Set up renderer
  useEffect(() => {
    // Enable tone mapping for better visuals
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = theme === 'dark' ? 0.8 : 1.2;
    
    // Optimize rendering
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  }, [gl, theme]);
  
  // Create multiple floating shapes with different positions and colors
  const shapes = [
    { position: [-4, 2, -6], color: '#64FFDA', size: 0.8 },   // Teal
    { position: [5, -1, -10], color: '#FFB74D', size: 1.2 },  // Orange
    { position: [-2, -3, -8], color: '#9C27B0', size: 0.9 },  // Purple
    { position: [3, 3, -7], color: '#64FFDA', size: 0.7 }     // Teal
  ];
  
  // Responsive design - adapt particle count
  const [particleCount, setParticleCount] = useState(150);
  
  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setParticleCount(isMobile ? 50 : 150);
  }, []);
  
  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 10]}
        fov={50}
        near={0.1}
        far={100}
      />
      
      {/* Lighting */}
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={theme === 'dark' ? 0.5 : 0.8} 
        color={theme === 'dark' ? '#a0a0ff' : '#ffffff'} 
      />
      <directionalLight 
        position={[-10, -10, -5]} 
        intensity={0.3} 
        color={theme === 'dark' ? '#ff9060' : '#ffffa0'} 
      />
      
      {/* Environmental lighting */}
      <Environment preset="sunset" />
      
      {/* Background particles */}
      <FloatingParticles count={particleCount} />
      
      {/* Decorative shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          position={shape.position as [number, number, number]}
          color={shape.color}
          size={shape.size}
        />
      ))}
      
      {/* Performance optimizations */}
      <AdaptiveDpr pixelated />
    </>
  );
};

// Main component
const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]} // Optimized pixel ratio
        legacy={false} // Use modern rendering
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Background3D;