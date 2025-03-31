import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Terrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture 
  const texture = useTexture("/textures/sky.png");
  
  // Create noise pattern for the terrain
  const generateNoise = () => {
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const { position } = geometry.attributes;
    
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // Create some subtle terrain variation
      const z = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 2;
      
      position.setZ(i, z);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle animation of the terrain
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -10, -20]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <primitive object={generateNoise()} attach="geometry" />
      <meshStandardMaterial
        color="#0A192F"
        map={texture}
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
};

export default Terrain;
