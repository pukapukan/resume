import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Technologies shown in 3D space
const technologies = [
  { name: "React", position: [-3, 3, -2] },
  { name: "TypeScript", position: [2, 4, -3] },
  { name: "Node.js", position: [3, 0, -5] },
  { name: "Java", position: [-2, -1, -4] },
  { name: "GraphQL", position: [0, 2, -6] },
  { name: "AWS", position: [-4, -3, -5] },
  { name: "Ruby", position: [4, -2, -4] },
  { name: "Docker", position: [-5, 1, -3] },
  { name: "Postgres", position: [5, -4, -2] }
];

const SkillsIcons = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);
  const [techScales, setTechScales] = useState<Record<string, number>>({});

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle rotation of the entire group
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  // Randomize colors for each skill
  const getColor = (index: number) => {
    const colors = ["#64FFDA", "#FFB74D", "#E6F1FF"];
    return colors[index % colors.length];
  };
  
  useEffect(() => {
    // Initialize with zero scale
    const initialScales: Record<string, number> = {};
    technologies.forEach(tech => {
      initialScales[tech.name] = 0;
    });
    setTechScales(initialScales);
    
    // Show group after delay
    const visibilityTimer = setTimeout(() => {
      setVisible(true);
    }, 1000);
    
    // Animate each tech scale with staggered delay
    const scaleTimers: NodeJS.Timeout[] = [];
    
    technologies.forEach((tech, index) => {
      const timer = setTimeout(() => {
        setTechScales(prev => ({
          ...prev,
          [tech.name]: 1
        }));
      }, 1000 + (index * 100));
      
      scaleTimers.push(timer);
    });
    
    return () => {
      clearTimeout(visibilityTimer);
      scaleTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <group ref={groupRef} visible={visible}>
      {technologies.map((tech, index) => {
        const scale = techScales[tech.name] || 0;
        
        return (
          <group 
            key={tech.name} 
            position={[tech.position[0], tech.position[1], tech.position[2]]}
          >
            <group scale={[scale, scale, scale]}>
              <Text
                color={getColor(index)}
                fontSize={0.5}
                maxWidth={2}
                lineHeight={1}
                textAlign="center"
                font="/fonts/inter.json"
                anchorX="center"
                anchorY="middle"
              >
                {tech.name}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default SkillsIcons;
