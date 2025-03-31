import { useEffect, useState } from 'react';
import { Perf } from 'r3f-perf';

interface PerformanceMonitorProps {
  showPerformance?: boolean;
}

/**
 * Performance monitoring component for React Three Fiber
 * Only renders in development mode and can be toggled with 'p' key
 */
const PerformanceMonitor = ({ showPerformance = false }: PerformanceMonitorProps) => {
  const [perfVisible, setPerfVisible] = useState(showPerformance);
  
  useEffect(() => {
    // Toggle perf monitor with 'p' key (for development)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p') {
        setPerfVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development' && !window.location.href.includes('localhost')) {
    return null;
  }
  
  return perfVisible ? (
    <Perf 
      position="top-left" 
      minimal={false}
      matrixUpdate={true}
      deepAnalyze={true}
    />
  ) : null;
};

export default PerformanceMonitor;