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
    
    // Create a custom event for mobile browser overscroll protection
    // This helps other components handle negative scroll values
    const handleScroll = () => {
      // Create a custom event with normalized scroll position
      // This ensures scroll position is never negative
      const scrollEvent = new CustomEvent('safeScroll', {
        detail: {
          scrollY: Math.max(0, window.scrollY)
        }
      });
      document.dispatchEvent(scrollEvent);
    };
    
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
    
    // Add event listeners
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set up correct scroll values
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
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
