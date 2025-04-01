import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeStore } from '../lib/stores/useThemeStore';

// Skill categories with their respective skills
const SKILLS_DATA = {
  frontend: [
    'React', 
    'TypeScript', 
    'JavaScript',
    'CSS/SCSS',
    'HTML5'
  ],
  backend: [
    'Node.js',
    'Express',
    'Java',
    'PostgreSQL',
    'RESTful APIs'
  ],
  tools: [
    'Git/GitHub',
    'VS Code',
    'Docker',
    'AWS',
    'GraphQL'
  ],
  design: [
    'UI/UX',
    'Figma',
    'Responsive Design',
    'Tailwind CSS',
    'Material UI'
  ]
};

// Helper to get color based on category
function getCategoryColor(skill: string, skillsData: Record<string, string[]>): string {
  // Check which category the skill belongs to
  if (skillsData.frontend.includes(skill)) return '#61DAFB'; // React blue
  if (skillsData.backend.includes(skill)) return '#68A063';  // Node.js green
  if (skillsData.tools.includes(skill)) return '#FF9800';    // Tools orange
  if (skillsData.design.includes(skill)) return '#FF4081';   // Design pink
  return '#64FFDA'; // Default teal
}

interface SkillNodeProps {
  name: string;
  position: [number, number, number];
  color: string;
  onClick?: () => void;
}

// Individual 3D node representing a skill
const SkillNode: React.FC<SkillNodeProps> = ({ name, position, color, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const theme = useThemeStore(state => state.theme);
  
  // Handle pointer events
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  const onPointerDown = () => {
    setActive(!active);
    if (onClick) onClick();
  };
  
  // Animation
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Basic rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Scale when hovered
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.2, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.2, 0.1);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.2, 0.1);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1);
      }
    }
  });
  
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerDown={onPointerDown}
        >
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial 
            color={hovered ? '#ffffff' : color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        <Text
          position={[0, -1, 0]}
          fontSize={0.35}
          color={theme === 'dark' ? '#ffffff' : '#1a1a1a'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={theme === 'dark' ? '#000000' : '#ffffff'}
        >
          {name}
        </Text>
      </group>
    </Float>
  );
};

// Scene component with all skills
const SkillsScene: React.FC = () => {
  const { camera } = useThree();
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const theme = useThemeStore(state => state.theme);
  
  // Distribute skills in a circular pattern
  const skillNodes = useMemo(() => {
    const nodes: Array<{ name: string; position: [number, number, number]; color: string }> = [];
    
    // Get all skills in a flat array
    const allSkills: string[] = Object.values(SKILLS_DATA).flat();
    
    const radius = 5;
    const totalSkills = allSkills.length;
    
    allSkills.forEach((skill, index) => {
      // Distribute evenly in a spiral pattern
      const angle = (index / totalSkills) * Math.PI * 10; // Multiple rotations
      const height = (index / totalSkills) * 4 - 2; // Distribute vertically between -2 and 2
      const distance = radius * Math.sqrt(index / totalSkills); // Spiral out
      
      const x = Math.cos(angle) * distance;
      const y = height;
      const z = Math.sin(angle) * distance;
      
      nodes.push({
        name: skill,
        position: [x, y, z],
        color: getCategoryColor(skill, SKILLS_DATA)
      });
    });
    
    return nodes;
  }, []);
  
  // Setup and camera control
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  
  // Auto-rotation for the entire scene
  const sceneRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.05;
    }
  });
  
  return (
    <group ref={sceneRef}>
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        color={theme === 'dark' ? '#a0a0ff' : '#ffffff'} 
      />
      
      {skillNodes.map((node: { name: string; position: [number, number, number]; color: string }, i: number) => (
        <SkillNode
          key={i}
          name={node.name}
          position={node.position}
          color={node.color}
          onClick={() => setActiveSkill(node.name === activeSkill ? null : node.name)}
        />
      ))}
    </group>
  );
};

// Main component for the skills section
const InteractiveSkills: React.FC = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative rounded-lg overflow-hidden my-8">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <SkillsScene />
        </Suspense>
      </Canvas>
      
      {/* Labels for skill categories */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#61DAFB' }}></span>
            <span className="ml-2 text-sm font-mono">Frontend</span>
          </div>
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#68A063' }}></span>
            <span className="ml-2 text-sm font-mono">Backend</span>
          </div>
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9800' }}></span>
            <span className="ml-2 text-sm font-mono">Tools</span>
          </div>
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#FF4081' }}></span>
            <span className="ml-2 text-sm font-mono">Design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSkills;