import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSectionStore } from '../lib/stores/useSectionStore';

// Define location coordinates (longitude, latitude)
interface Location {
  city: string;
  coords: [number, number]; // [longitude, latitude]
  color: string;
  company: string;
}

// Map of work experience locations
const LOCATIONS: Location[] = [
  { 
    city: 'Seattle', 
    coords: [-122.3321, 47.6062], 
    color: '#FF9900', // Amazon orange
    company: 'Amazon'
  },
  { 
    city: 'San Francisco', 
    coords: [-122.4194, 37.7749], 
    color: '#635BFF', // Stripe purple
    company: 'Stripe'
  },
  { 
    city: 'New York', 
    coords: [-74.0060, 40.7128], 
    color: '#4285F4', // Blue
    company: 'Fintech Startup'
  },
  { 
    city: 'Los Angeles', 
    coords: [-118.2437, 34.0522], 
    color: '#FF4B4B', // Red
    company: 'Tech Innovators'
  }
];

// Convert lat/long to 3D coordinates on a sphere
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// The marker that highlights a location
function LocationMarker({ position, color, isActive }: { 
  position: THREE.Vector3, 
  color: string,
  isActive: boolean
}) {
  const markerRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (markerRef.current) {
      if (isActive) {
        markerRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
      } else {
        markerRef.current.scale.setScalar(0.8);
      }
    }
  });

  return (
    <mesh ref={markerRef} position={position} scale={isActive ? 1 : 0.8}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={isActive ? 1 : 0.3} 
        toneMapped={false} 
      />
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.13, 0.15, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </mesh>
  );
}

// Line connecting a marker to its label
function ConnectionLine({ start, end, color }: { 
  start: THREE.Vector3, 
  end: THREE.Vector3, 
  color: string 
}) {
  const points = useMemo(() => [start, end], [start, end]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.6} linewidth={1} />
    </line>
  );
}

// The Earth globe
function Earth({ activeLocation }: { activeLocation: string }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Subtle rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
  });

  // Load earth texture
  const texture = useLoader(THREE.TextureLoader, '/assets/earth-dark.jpg');
  
  // Configure texture
  useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={1} 
          metalness={0} 
          color="#113355" 
        />
      </mesh>
      
      {/* Location markers */}
      {LOCATIONS.map((location) => {
        const position = latLongToVector3(location.coords[1], location.coords[0], 2);
        const isActive = location.company === activeLocation;
        
        return (
          <group key={location.city}>
            <LocationMarker 
              position={position} 
              color={location.color}
              isActive={isActive}
            />
            {isActive && (
              <ConnectionLine 
                start={position} 
                end={position.clone().multiplyScalar(1.3)} 
                color={location.color} 
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

interface GlobeProps {
  activeCompany: string;
}

// Globe Scene component
function GlobeScene({ activeCompany }: GlobeProps) {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.7} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      
      <Suspense fallback={null}>
        <Earth activeLocation={activeCompany} />
      </Suspense>
    </Canvas>
  );
}

// Move preload inside the component
function preloadTexture() {
  useLoader.preload(THREE.TextureLoader, '/assets/earth-dark.jpg');
}

// Main Globe component
export default function Globe() {
  const [activeCompany, setActiveCompany] = useState('');
  const [currentExperience, setCurrentExperience] = useState<number | null>(null);
  const { activeSection } = useSectionStore();
  
  // Preload texture on component mount
  useEffect(() => {
    preloadTexture();
  }, []);
  
  // Monitor the scroll position to determine which experience is currently in view
  useEffect(() => {
    const handleScroll = () => {
      if (activeSection !== 'experience') return;
      
      const experienceItems = document.querySelectorAll('.experience-item');
      if (!experienceItems.length) return;
      
      let currentIndex = null;
      
      experienceItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
          currentIndex = index;
        }
      });
      
      setCurrentExperience(currentIndex);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);
  
  // Update active company when current experience changes
  useEffect(() => {
    if (currentExperience === null) return;
    
    const experienceItems = document.querySelectorAll('.experience-item');
    if (!experienceItems.length) return;
    
    const companyElement = experienceItems[currentExperience].querySelector('.company-name');
    if (companyElement) {
      const company = companyElement.textContent || '';
      
      // Find the matching location
      const location = LOCATIONS.find(loc => company.includes(loc.company));
      
      if (location) {
        setActiveCompany(location.company);
      } else {
        setActiveCompany('');
      }
    }
  }, [currentExperience]);
  
  return (
    <div className={`fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none ${
      activeSection === 'experience' ? 'opacity-40' : 'opacity-0'
    }`}>
      <GlobeScene activeCompany={activeCompany} />
    </div>
  );
}