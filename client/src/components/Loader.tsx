import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import * as THREE from "three";

// 3D Progress Shape component
const ProgressShape = ({ progress = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Rotate the shape continuously
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

  // Smoothly interpolate shape scale based on progress
  const scale = MathUtils.lerp(0.1, 1, progress);
  
  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial 
        color="#64FFDA" 
        emissive="#64FFDA"
        emissiveIntensity={0.5}
        roughness={0.2} 
        metalness={0.8} 
      />
    </mesh>
  );
};

// Progress Text Display
const ProgressText = ({ progress }: { progress: number }) => (
  <motion.p 
    className="font-mono text-secondary mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    Loading... {Math.round(progress * 100)}%
  </motion.p>
);

// Loading Messages to display during loading
const loadingMessages = [
  "Gathering creative particles...",
  "Assembling portfolio components...",
  "Polishing pixels...",
  "Configuring experience...",
  "Almost ready..."
];

// Main Loader Component
export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + 0.01;
        return nextProgress >= 1 ? 1 : nextProgress;
      });
    }, 50);
    
    // Change loading message every 2 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* 3D Canvas for the Loading Indicator */}
        <div className="w-48 h-48 relative">
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 45 }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ProgressShape progress={progress} />
          </Canvas>
          
          {/* Circular progress indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 border-2 border-transparent border-t-secondary rounded-full"
                style={{
                  borderWidth: `${Math.max(2, progress * 4)}px`,
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Progress text */}
        <ProgressText progress={progress} />
        
        {/* Loading message */}
        <motion.p 
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground mt-2 text-center max-w-md px-4"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </motion.div>
    </div>
  );
};
