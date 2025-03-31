import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, useScroll } from "@react-three/drei";
import * as THREE from "three";

import FloatingParticles from "./scene/FloatingParticles";
import FloatingObject from "./scene/FloatingObject";
import SkillsIcons from "./scene/SkillsIcons";
import Terrain from "./scene/Terrain";

const Canvas3D = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Update camera and objects based on scroll
  useFrame(() => {
    // Safety checks
    if (!cameraRef.current || !groupRef.current) return;
    if (!scroll || typeof scroll.offset !== 'number') return;
    
    // Get current scroll offset (0 to 1)
    const scrollOffset = Math.max(0, Math.min(1, scroll.offset)); // Clamp between 0 and 1
    
    try {
      // Move camera based on scroll
      cameraRef.current.position.y = THREE.MathUtils.lerp(
        5, // Starting y position
        -15, // Ending y position
        scrollOffset
      );
      
      // Tilt camera based on scroll for dynamic feel
      cameraRef.current.rotation.x = THREE.MathUtils.lerp(
        0.1, // Starting rotation
        0.6, // Ending rotation
        scrollOffset
      );
      
      // Rotate group slightly for parallax effect
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        0,
        Math.PI * 0.1,
        scrollOffset
      );
    } catch (error) {
      console.error("Error in Canvas3D animation frame:", error);
    }
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, 5, 10]}
        fov={75}
        near={0.1}
        far={100}
      />
      
      <hemisphereLight intensity={0.5} groundColor="#0a192f" />
      <directionalLight
        position={[0, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <Environment preset="city" />
      
      <group ref={groupRef}>
        <Suspense fallback={null}>
          <FloatingParticles count={200} />
          <SkillsIcons />
          <Terrain />
        </Suspense>
        
        <FloatingObject
          position={[3, 2, -3]}
          scale={1}
          rotation={[0.5, 0, 0.2]}
          color="#64FFDA"
        />
        
        <FloatingObject
          position={[-4, 0, -2]}
          scale={0.8}
          rotation={[0.2, 0.3, 0.1]}
          color="#FFB74D"
        />
        
        <FloatingObject
          position={[0, -5, -3]}
          scale={1.2}
          rotation={[0.1, 0.2, 0.3]}
          color="#64FFDA"
        />
      </group>
    </>
  );
};

export default Canvas3D;
