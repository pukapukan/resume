import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Vector3 } from "three";

interface FloatingParticlesProps {
  count?: number;
}

const FloatingParticles = ({ count = 100 }: FloatingParticlesProps) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Generate random particles positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);
  
  // Generate random sizes for particles
  const sizes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(Math.random() * 0.5 + 0.1);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Slow rotation for ambient movement
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
    mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
        <bufferAttribute 
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        color="#64FFDA"
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default FloatingParticles;
