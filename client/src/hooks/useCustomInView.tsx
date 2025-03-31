import { useEffect, useState, useRef } from "react";
import { useSectionStore } from "../lib/stores/useSectionStore";

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  // If true, will only update active section if user hasn't recently clicked a section
  respectClickState?: boolean;
}

// Named function to help React Fast Refresh
function useCustomInViewHook(options: InViewOptions = {}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const { timeOfLastClick } = useSectionStore();
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set inView if user hasn't clicked recently (within the last 1 second)
        // or if respectClickState is false
        const shouldUpdateInView = options.respectClickState === false || 
          Date.now() - timeOfLastClick > 1000;
        
        if (shouldUpdateInView) {
          setInView(entry.isIntersecting);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin, timeOfLastClick, options.respectClickState]);
  
  return { ref, inView };
}

// Export the hook - keeps consistent naming for imports
export const useCustomInView = useCustomInViewHook;