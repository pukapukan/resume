import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "../../lib/stores/useThemeStore";

interface FloatingParticlesProps {
  count?: number;
}

const FloatingParticles = ({ count = 100 }: FloatingParticlesProps) => {
  const theme = useThemeStore(state => state.theme);
  const particles = useRef<THREE.Points>(null);
  
  // Create a memoized particle system
  const particleSystem = useMemo(() => {
    // Create geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Particle distribution in 3D space
    const color1 = new THREE.Color(theme === 'dark' ? '#64FFDA' : '#64FFDA');
    const color2 = new THREE.Color(theme === 'dark' ? '#FFB74D' : '#FFB74D');
    
    for (let i = 0; i < count; i++) {
      // Random position within a sphere
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 25 * Math.cbrt(Math.random()); // Cube root for better distribution
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 30; // Push back in z space
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Random color between two theme colors
      const mixFactor = Math.random();
      const particleColor = new THREE.Color().lerpColors(color1, color2, mixFactor);
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
      
      // Random size, weighted toward smaller particles
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return particlesGeometry;
  }, [count, theme]);
  
  // Material for particles
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
  }, []);
  
  // Animation for particles
  useFrame((_, delta) => {
    if (particles.current) {
      // Slow gentle rotation around Y axis for ambient movement
      particles.current.rotation.y += delta * 0.05;
      particles.current.rotation.x += delta * 0.02;
    }
  });
  
  return (
    <points ref={particles} geometry={particleSystem} material={particleMaterial} />
  );
};

export default FloatingParticles;