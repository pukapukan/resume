import { useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveCube from './InteractiveCube';
import { useGame } from '../../lib/stores/useGame';

// Skills data - categories and specific skills
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
    'Python',
    'PostgreSQL',
    'RESTful APIs'
  ],
  tools: [
    'Git/GitHub',
    'VS Code',
    'Webpack',
    'Docker',
    'AWS'
  ],
  design: [
    'Figma',
    'UI/UX',
    'Responsive Design',
    'Tailwind CSS',
    'Material UI'
  ]
};

interface SkillsCubesProps {
  maxCubes?: number;
  radius?: number;
  yOffset?: number;
}

const SkillsCubes = ({ 
  maxCubes = 20, 
  radius = 5, 
  yOffset = 2 
}: SkillsCubesProps) => {
  const { viewport } = useThree();
  const { phase } = useGame();
  const [visibleCount, setVisibleCount] = useState(0);
  
  // Flatten skill categories into a single array of skills
  const allSkills = useMemo(() => {
    const skills: string[] = [];
    Object.values(SKILLS_DATA).forEach(categorySkills => {
      skills.push(...categorySkills);
    });
    return skills;
  }, []);
  
  // Calculate cube positions in a spiral pattern
  const cubePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const skillCount = Math.min(allSkills.length, maxCubes);
    
    try {
      // Create a spiral layout
      for (let i = 0; i < skillCount; i++) {
        // Spiral parameters
        const angle = i * 0.5; // rotation around Y axis
        const height = Math.sin(i * 0.4) * 2; // variation in height
        
        // Calculate position using spiral formula
        const x = Math.cos(angle) * (radius - i * 0.1);
        const y = height + yOffset;
        const z = Math.sin(angle) * (radius - i * 0.1);
        
        positions.push([x, y, z]);
      }
    } catch (error) {
      console.error('Error calculating cube positions:', error);
      
      // Fallback to simple grid layout in case of error
      const gridSize = Math.ceil(Math.sqrt(skillCount));
      for (let i = 0; i < skillCount; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        positions.push([
          (col - gridSize / 2) * 2, 
          yOffset, 
          (row - gridSize / 2) * 2
        ]);
      }
    }
    
    return positions;
  }, [maxCubes, radius, yOffset, allSkills.length]);
  
  // Generate random cube sizes based on viewport for responsive sizing
  const cubeSizes = useMemo(() => {
    const sizes: number[] = [];
    const skillCount = Math.min(allSkills.length, maxCubes);
    
    // Base size on viewport width for responsiveness
    const baseSize = Math.min(viewport.width * 0.05, 0.8);
    
    for (let i = 0; i < skillCount; i++) {
      // Slightly vary sizes for visual interest
      const size = baseSize * (0.8 + Math.random() * 0.4);
      sizes.push(size);
    }
    
    return sizes;
  }, [maxCubes, viewport.width, allSkills.length]);
  
  // Show cubes gradually for animation effect
  useEffect(() => {
    if (phase === 'playing' && visibleCount < Math.min(allSkills.length, maxCubes)) {
      const timer = setInterval(() => {
        setVisibleCount(prev => {
          const next = prev + 1;
          if (next >= Math.min(allSkills.length, maxCubes)) {
            clearInterval(timer);
          }
          return next;
        });
      }, 150); // Add a new cube every 150ms
      
      return () => clearInterval(timer);
    }
  }, [phase, maxCubes, allSkills.length, visibleCount]);
  
  // If not playing, don't render anything
  if (phase !== 'playing') {
    return null;
  }
  
  return (
    <group>
      {cubePositions.slice(0, visibleCount).map((position, index) => (
        <InteractiveCube
          key={`skill-cube-${index}`}
          id={`skill-${index}`}
          position={position}
          size={cubeSizes[index]}
          text={allSkills[index]}
          color={getCategoryColor(allSkills[index], SKILLS_DATA)}
        />
      ))}
    </group>
  );
};

// Helper function to get color based on skill category
function getCategoryColor(skill: string, skillsData: Record<string, string[]>): string {
  if (skillsData.frontend.includes(skill)) return '#64FFDA';
  if (skillsData.backend.includes(skill)) return '#F08080';
  if (skillsData.tools.includes(skill)) return '#82AAFF';
  if (skillsData.design.includes(skill)) return '#C792EA';
  return '#64FFDA'; // Default color
}

export default SkillsCubes;