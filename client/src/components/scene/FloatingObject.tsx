import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingObjectProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}

const FloatingObject = ({ position, scale, rotation, color }: FloatingObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Generate vertices for a custom shape
  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Add subtle floating animation
    meshRef.current.position.y += Math.sin(state.clock.getElapsedTime()) * 0.003;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.001;
  });

  const [currentScale, setCurrentScale] = useState(0);
  const initialDelay = useMemo(() => Math.random() * 1000, []);
  
  useEffect(() => {
    // Create a delayed animation effect
    const timer = setTimeout(() => {
      setCurrentScale(scale);
    }, initialDelay);
    
    return () => clearTimeout(timer);
  }, [scale, initialDelay]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[currentScale, currentScale, currentScale]}
      rotation={rotation}
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.4}
        flatShading
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

export default FloatingObject;
