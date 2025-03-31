import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, ScrollControls as DreiScrollControls } from "@react-three/drei";
import { useSectionStore } from "../lib/stores/useSectionStore";

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
    if (!activeSection) return;
    if (!scroll || !scroll.el) return;
    
    try {
      const section = document.getElementById(activeSection);
      if (!section) {
        console.warn(`Section with ID ${activeSection} not found in DOM`);
        return;
      }
      
      const sectionTop = section.offsetTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      
      // Avoid division by zero
      if (docHeight <= windowHeight) {
        console.warn('Document height is too small for scroll calculation');
        return;
      }
      
      const scrollPosition = sectionTop / (docHeight - windowHeight);
      
      // Safely set scroll position
      if (scroll.el && scroll.el.scrollHeight > 0) {
        // Clamp value between 0 and scroll.el.scrollHeight
        const targetPosition = Math.max(0, Math.min(
          scrollPosition * scroll.el.scrollHeight,
          scroll.el.scrollHeight
        ));
        
        scroll.el.scrollTop = targetPosition;
      }
    } catch (error) {
      console.error('Error in ScrollControls sync effect:', error);
    }
  }, [activeSection, scroll]);
  
  // Update 3D elements based on scroll
  useFrame(() => {
    // Only proceed if scroll is properly initialized
    if (!scroll || typeof scroll.offset !== 'number') return;
    
    try {
      // Get current scroll progress (0 to 1) with safety clamping
      const scrollProgress = Math.max(0, Math.min(1, scroll.offset));
      
      // This frame handler is mostly to monitor scroll events
      // Actual 3D transformations are handled in the Canvas3D component
      
      // Add debugging if needed
      // console.log('Scroll progress:', scrollProgress);
    } catch (error) {
      console.error('Error in ScrollControls frame update:', error);
    }
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
