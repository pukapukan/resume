import { Suspense, useRef, useCallback, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  PerspectiveCamera, 
  Environment, 
  useScroll, 
  AdaptiveDpr, 
  BakeShadows,
  useGLTF
} from "@react-three/drei";
import * as THREE from "three";

import FloatingParticles from "./scene/FloatingParticles";
import FloatingObject from "./scene/FloatingObject";
import SkillsIcons from "./scene/SkillsIcons";
import SkillsCubes from "./scene/SkillsCubes";
import Terrain from "./scene/Terrain";
import PerformanceMonitor from "./scene/PerformanceMonitor";
import { useThemeStore } from "../lib/stores/useThemeStore";
import { useGame } from "../lib/stores/useGame";
import GameStatus from "./ui/GameStatus";

// Preload to avoid pop-in during scrolling
useGLTF.preload("/models/skills/react.glb");
useGLTF.preload("/models/skills/js.glb");
useGLTF.preload("/models/skills/ts.glb");

const Canvas3D = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { gl } = useThree();
  const theme = useThemeStore(state => state.theme);
  
  // Optimization: Memoize particle count based on device performance
  const [particleCount, setParticleCount] = useState(200);
  
  // Detect device performance once on mount
  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Adjust particle count based on device
    if (isMobile) {
      setParticleCount(50); // Fewer particles for mobile
    } else {
      // Check GPU capabilities via WebGL
      const gl = document.createElement('canvas').getContext('webgl');
      if (!gl) {
        setParticleCount(100); // Fallback for older browsers
      } else {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // Lower particle count for integrated graphics
          if (renderer.includes('Intel')) {
            setParticleCount(100);
          }
        }
      }
    }
    
    // Enable tone mapping for better contrast
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = theme === 'dark' ? 0.8 : 1.2;
    
    // Optimize rendering
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Limit maximum pixel ratio
  }, [gl, theme]);
  
  // Optimization: Use memoized objects for animation
  const animationValues = useMemo(() => ({
    cameraStart: new THREE.Vector3(0, 5, 10),
    cameraEnd: new THREE.Vector3(0, -15, 10),
    rotationStart: new THREE.Euler(0.1, 0, 0),
    rotationEnd: new THREE.Euler(0.6, 0, 0),
    groupRotationStart: new THREE.Euler(0, 0, 0),
    groupRotationEnd: new THREE.Euler(0, Math.PI * 0.1, 0)
  }), []);
  
  // Optimization: Use callback for frame updates
  const updateScene = useCallback((scrollOffset: number) => {
    if (!cameraRef.current || !groupRef.current) return;
    
    // Move camera based on scroll using vectors
    cameraRef.current.position.y = THREE.MathUtils.lerp(
      animationValues.cameraStart.y,
      animationValues.cameraEnd.y,
      scrollOffset
    );
    
    // Tilt camera based on scroll for dynamic feel
    cameraRef.current.rotation.x = THREE.MathUtils.lerp(
      animationValues.rotationStart.x,
      animationValues.rotationEnd.x,
      scrollOffset
    );
    
    // Rotate group slightly for parallax effect
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      animationValues.groupRotationStart.y,
      animationValues.groupRotationEnd.y,
      scrollOffset
    );
  }, [animationValues]);

  // Update scene on scroll
  useFrame(() => {
    // Safety checks
    if (!cameraRef.current || !groupRef.current) return;
    if (!scroll || typeof scroll.offset !== 'number') return;
    
    // Get current scroll offset (0 to 1)
    const scrollOffset = Math.max(0, Math.min(1, scroll.offset)); // Clamp between 0 and 1
    
    try {
      updateScene(scrollOffset);
    } catch (error) {
      console.error("Error in Canvas3D animation frame:", error);
    }
  });

  // Access game state
  const { phase } = useGame();
  
  return (
    <>
      {/* Performance optimization components */}
      <PerformanceMonitor showPerformance={false} />
      <AdaptiveDpr pixelated />
      <BakeShadows />
      
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, 5, 10]}
        fov={75}
        near={0.1}
        far={100}
      />
      
      {/* Simplified lighting for better performance */}
      <hemisphereLight intensity={0.5} groundColor={theme === 'dark' ? "#0a192f" : "#e6f1ff"} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      >
        {/* Optimize shadow rendering */}
        <orthographicCamera 
          attach="shadow-camera" 
          args={[-10, 10, 10, -10, 0.1, 50]} 
        />
      </directionalLight>
      
      {/* Memoize environment to prevent re-rendering */}
      {useMemo(() => (
        <Environment preset="city" />
      ), [])}
      
      <group ref={groupRef}>
        <Suspense fallback={null}>
          <FloatingParticles count={particleCount} />
          
          {/* Only show one set of skills visualization based on game phase */}
          {phase === 'playing' ? (
            <SkillsCubes maxCubes={20} radius={5} yOffset={2} />
          ) : (
            <SkillsIcons />
          )}
          
          <Terrain />
        </Suspense>
        
        {/* Memoize static objects */}
        {useMemo(() => (
          <>
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
          </>
        ), [])}
      </group>
    </>
  );
};

export default Canvas3D;
