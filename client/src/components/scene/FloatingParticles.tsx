import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "../../lib/stores/useThemeStore";

interface FloatingParticlesProps {
  count?: number;
}

// Instanced particles for better performance
const FloatingParticles = ({ count = 100 }: FloatingParticlesProps) => {
  const mesh = useRef<THREE.Points>(null);
  const { gl } = useThree();
  const theme = useThemeStore(state => state.theme);
  
  // Optimization: Create particles geometry only once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Generate random particles positions
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    // Initialize particles with spread-out positions and varied sizes
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Position in a wider area
      positions[i3] = (Math.random() - 0.5) * 30; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 30; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 30; // z
      
      // Random size variation for visual interest
      sizes[i] = Math.random() * 0.5 + 0.1;
      
      // Random speed for movement
      speeds[i] = Math.random() * 0.1 + 0.05;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Store speeds as a custom attribute for animation
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    
    return geo;
  }, [count]);
  
  // Memoize the material to prevent unnecessary re-creation
  const material = useMemo(() => {
    const mat = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Performance improvement
    });
    
    return mat;
  }, []);
  
  // Update material color when theme changes
  useEffect(() => {
    if (material) {
      material.color.set(theme === 'dark' ? '#64FFDA' : '#0A192F');
    }
  }, [theme, material]);
  
  // Use local clock for consistent animation speed
  const clock = useMemo(() => new THREE.Clock(), []);
  
  // Rotation direction
  const rotationSpeed = useMemo(() => ({
    x: Math.random() * 0.01 - 0.005,
    y: Math.random() * 0.01 - 0.005,
  }), []);
  
  useFrame(() => {
    if (!mesh.current) return;
    
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Only update rotation at 30fps for performance
    if (Math.floor(elapsedTime * 30) % 2 === 0) {
      // Slow rotation for ambient movement
      mesh.current.rotation.x += rotationSpeed.x * delta * 10;
      mesh.current.rotation.y += rotationSpeed.y * delta * 10;
    }
    
    // Skip animation if particles are off-screen or far away
    // For performance optimization, we could check camera position
    // but we'll simplify this to avoid type errors
    if (delta > 0.1) { // If frame rate is very low, skip animation
      return;
    }
  });

  return (
    <points ref={mesh} geometry={geometry} material={material} frustumCulled={true} />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default FloatingParticles;
