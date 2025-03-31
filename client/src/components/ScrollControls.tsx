import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, ScrollControls as DreiScrollControls } from "@react-three/drei";
import { useSectionStore } from "@/lib/stores/useSectionStore";

interface ScrollControlsProps {
  children: React.ReactNode;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useSectionStore();
  const { size } = useThree();
  const scroll = useScroll();
  
  // Sync scroll position with active section
  useEffect(() => {
    if (activeSection && scrollRef.current && scroll.el) {
      const section = document.getElementById(activeSection);
      if (section) {
        const sectionTop = section.offsetTop;
        const windowHeight = window.innerHeight;
        const scrollPosition = sectionTop / (document.body.scrollHeight - windowHeight);
        
        // Make sure scroll.el exists before accessing its properties
        if (scroll.el) {
          scroll.el.scrollTop = scrollPosition * scroll.el.scrollHeight;
        }
      }
    }
  }, [activeSection, scroll]);
  
  // Update 3D elements based on scroll
  useFrame(() => {
    // Only proceed if scroll is properly initialized
    if (!scroll) return;
    
    // Get current scroll progress (0 to 1)
    const scrollProgress = scroll.offset;
    
    // You can use this to update your 3D scene based on scroll position
    // For example, camera movement, object rotations, etc.
  });
  
  return (
    <DreiScrollControls
      pages={5} // Approximate number of pages (update based on your sections)
      damping={0.2}
      distance={1}
    >
      {children}
    </DreiScrollControls>
  );
};

export default ScrollControls;
