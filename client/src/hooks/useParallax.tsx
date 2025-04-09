import { useState, useEffect } from 'react';

/**
 * Custom hook to manage parallax effects based on scroll position
 * 
 * @param speed The parallax speed multiplier (positive values move slower than scroll, negative values move faster)
 * @param direction 'vertical' or 'horizontal'
 * @returns Current parallax offset value
 */
export function useParallax(speed: number = 0.5, direction: 'vertical' | 'horizontal' = 'vertical') {
  // Store the parallax offset
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Function to calculate the parallax offset based on scroll position
    const handleScroll = () => {
      const scrollPosition = direction === 'vertical' 
        ? window.scrollY 
        : window.scrollX;
      
      // Calculate new offset value
      // For positive speed: content moves slower than scroll (divide by speed)
      // For negative speed: content moves in opposite direction of scroll
      const newOffset = scrollPosition * speed;
      
      // Update state with new offset
      setOffset(newOffset);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Run once on mount to initialize
    handleScroll();
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return offset;
}