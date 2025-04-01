import { useEffect, useRef, ReactNode } from "react";
import { useSectionStore } from "../lib/stores/useSectionStore";

interface ScrollControlsProps {
  children: ReactNode;
}

/**
 * ScrollControls - A component that enables better scroll handling and fixes scrolling issues
 * This version doesn't use Three.js as we've removed the game/3D components
 */
export const ScrollControls = ({ children }: ScrollControlsProps) => {
  const { activeSection } = useSectionStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll behavior overrides for better cross-browser compatibility
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    // Enable scrolling by adding overflow settings
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Handle special scrolling cases like hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          console.log(`Hash navigation to section: ${id}`);
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  return (
    <div 
      ref={scrollContainerRef} 
      className="w-full h-full"
      style={{ position: 'relative', overflowY: 'auto' }}
    >
      {children}
    </div>
  );
};
