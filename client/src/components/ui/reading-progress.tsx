import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  color?: string;
  height?: number;
  opacity?: number;
  shadow?: boolean;
}

/**
 * Gates Notes-style reading progress indicator
 * Shows a thin bar at the top of the page that fills as the user scrolls
 */
const ReadingProgress = ({ 
  color = '#64FFDA', 
  height = 2,
  opacity = 1,
  shadow = true
}: ReadingProgressProps) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      // Calculate how far down the page the user has scrolled
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll percentage and update width
      const scrollPercent = (scrollTop / docHeight) * 100;
      setWidth(scrollPercent);
    };

    // Set up event listener
    window.addEventListener('scroll', updateProgress);
    
    // Initial calculation
    updateProgress();
    
    // Clean up
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 z-[100] h-1" 
      style={{ 
        height: `${height}px`,
        width: `${width}%`,
        backgroundColor: color,
        opacity: opacity,
        transition: 'width 0.2s ease-out',
        boxShadow: shadow ? `0 0 6px ${color}` : 'none'
      }}
    />
  );
};

export default ReadingProgress;