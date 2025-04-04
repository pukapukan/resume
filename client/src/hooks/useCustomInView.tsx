import { useEffect, useState, useRef } from "react";
import { useSectionStore } from "../lib/stores/useSectionStore";

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
  // If true, will only update active section if user hasn't recently clicked a section
  respectClickState?: boolean;
  // Optional target element if you're using your own ref
  target?: HTMLElement | null;
}

// Named function to help React Fast Refresh
function useCustomInViewHook(options: InViewOptions = {}) {
  const [inView, setInView] = useState(false);
  const localRef = useRef<HTMLElement | null>(null);
  // Use either the provided target or our local ref
  const elementToObserve = options.target || localRef.current;
  const { timeOfLastClick } = useSectionStore();
  
  useEffect(() => {
    if (!elementToObserve) return;
    
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
    
    observer.observe(elementToObserve);
    
    return () => {
      if (elementToObserve) {
        observer.unobserve(elementToObserve);
      }
    };
  }, [
    options.threshold, 
    options.rootMargin, 
    timeOfLastClick, 
    options.respectClickState, 
    elementToObserve
  ]);
  
  return { ref: localRef, inView };
}

// Export the hook - keeps consistent naming for imports
export const useCustomInView = useCustomInViewHook;