import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../lib/stores/useGame';
import { useAudio } from '../../lib/stores/useAudio';

interface InteractiveCubeProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  hoverColor?: string;
  text?: string;
  id: string;
}

const InteractiveCube = ({
  position,
  size = 1,
  color = '#64FFDA',
  hoverColor = '#FFB74D',
  text = '',
  id
}: InteractiveCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  
  // State for hover and animation effects
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [scalePulse, setScalePulse] = useState(0);
  
  // Get our game store
  const { 
    incrementScore, 
    incrementInteraction, 
    activeCube, 
    setActiveCube,
    cubeRotationSpeed 
  } = useGame();
  
  // Get audio store for sound effects
  const { playHit, playSuccess } = useAudio();
  
  // Handle hover state
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  
  // Handle click event
  const onClick = () => {
    // Toggle clicked state
    const newClickedState = !clicked;
    setClicked(newClickedState);
    
    // Update game state
    incrementInteraction();
    incrementScore();
    setActiveCube(newClickedState ? id : null);
    
    // Play sound
    if (newClickedState) {
      playSuccess();
    } else {
      playHit();
    }
    
    // Create pulse effect
    setScalePulse(0.3);
    
    // Change rotation speed
    setRotationSpeed(newClickedState ? 0.05 : 0.01);
  };
  
  // Update based on global game state
  useEffect(() => {
    // If this cube was active but another cube is now active, deselect this one
    if (clicked && activeCube !== id && activeCube !== null) {
      setClicked(false);
      setRotationSpeed(0.01);
    }
  }, [activeCube, id, clicked]);
  
  // Update rotation speed based on global setting
  useEffect(() => {
    if (!clicked) {
      setRotationSpeed(cubeRotationSpeed);
    }
  }, [cubeRotationSpeed, clicked]);
  
  // Animation loop
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 1.5;
      
      // Apply pulse effect if active
      if (scalePulse > 0) {
        meshRef.current.scale.set(
          1 + scalePulse,
          1 + scalePulse,
          1 + scalePulse
        );
        setScalePulse(scalePulse - delta); // Decrease pulse effect over time
      } else if (scalePulse <= 0 && scalePulse !== 0) {
        setScalePulse(0);
        meshRef.current.scale.set(1, 1, 1);
      }
      
      // Hover effect
      if (hovered && !clicked) {
        meshRef.current.rotation.x += 0.02;
        meshRef.current.rotation.z += 0.02;
      }
      
      // Text always faces camera
      if (textRef.current) {
        textRef.current.lookAt(0, 0, 5);
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        scale={size}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={clicked ? hoverColor : hovered ? hoverColor : color}
          roughness={0.3}
          metalness={0.7}
          emissive={clicked ? hoverColor : hovered ? hoverColor : 'black'}
          emissiveIntensity={clicked ? 0.5 : hovered ? 0.2 : 0}
        />
      </mesh>
      
      {text && (
        <Text
          ref={textRef}
          position={[0, 0, size/2 + 0.1]}
          fontSize={0.15 * size}
          color="#E6F1FF"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          font="/fonts/Inter-Medium.woff"
        >
          {text}
        </Text>
      )}
    </group>
  );
};

export default InteractiveCube;