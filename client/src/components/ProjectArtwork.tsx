import { useEffect, useRef, useState, useMemo } from "react";
import { useCustomInView } from "../hooks/useCustomInView";

// Types of pixel art to render
type ArtworkType = 'fraud-system' | 'card-verification' | 'website-optimization' | 'community-platform';

interface ProjectArtworkProps {
  type: ArtworkType;
  className?: string;
  inView: boolean;
}

/**
 * ProjectArtwork - Renders SVG-based pixel art drawings for project cards
 * with a resolution transition effect similar to Gates Notes
 * Performance optimized to prevent scrolling jank
 */
const ProjectArtwork = ({ type, className = '', inView }: ProjectArtworkProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [resolution, setResolution] = useState(6); // Start with low resolution (higher number = fewer pixels)
  
  // Use the passed-in inView prop directly
  // This avoids causing re-renders from our own tracking
  const isVisible = inView;
  
  // Increase resolution when component comes into view - using RAF for smoother animation
  useEffect(() => {
    let rafId: number | null = null;
    let animationStartTime: number | null = null;
    const animationDuration = 800; // ms
    
    const animateResolution = (timestamp: number) => {
      if (!animationStartTime) animationStartTime = timestamp;
      const elapsed = timestamp - animationStartTime;
      
      if (elapsed < animationDuration) {
        // Calculate progress (0 to 1)
        const progress = elapsed / animationDuration;
        // Smoothly transition from 6 to 1 (exponential easing)
        const newResolution = 6 - (5 * Math.min(1, progress * progress));
        setResolution(Math.max(1, newResolution));
        
        // Continue animation
        rafId = requestAnimationFrame(animateResolution);
      } else {
        // Animation complete
        setResolution(1);
        rafId = null;
      }
    };
    
    if (isVisible) {
      // Use request animation frame for smoother animation
      rafId = requestAnimationFrame(animateResolution);
    } else {
      // Reset to low resolution when out of view
      setResolution(6);
      animationStartTime = null;
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible]);
  
  // Generate grid pattern based on resolution - memoized to prevent recalculation
  const gridSize = useMemo(() => resolution * 2, [resolution]); // Grid cell size
  
  // Round coordinates to grid - memoized function
  const snapToGrid = useMemo(() => {
    return (value: number) => Math.round(value / gridSize) * gridSize;
  }, [gridSize]);
  
  // Single monotone color for all artwork, matching the Stripe-inspired teal
  const mainColor = '#64FFDA';
  
  // Render different artwork based on type
  const renderArtwork = () => {
    switch (type) {
      case 'fraud-system':
        return (
          <g>
            {/* Shield shape */}
            <path 
              d={`M ${snapToGrid(50)} ${snapToGrid(20)} 
                  L ${snapToGrid(80)} ${snapToGrid(35)} 
                  L ${snapToGrid(80)} ${snapToGrid(65)}
                  L ${snapToGrid(50)} ${snapToGrid(80)}
                  L ${snapToGrid(20)} ${snapToGrid(65)}
                  L ${snapToGrid(20)} ${snapToGrid(35)} Z`}
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1.5 : 3}
            />
            
            {/* Lock icon */}
            <rect 
              x={snapToGrid(40)} 
              y={snapToGrid(45)} 
              width={snapToGrid(20)} 
              height={snapToGrid(20)} 
              rx={snapToGrid(2)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(50)} 
              cy={snapToGrid(45)} 
              r={snapToGrid(8)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Connection lines */}
            {resolution <= 4 && (
              <>
                <line 
                  x1={snapToGrid(20)} 
                  y1={snapToGrid(20)} 
                  x2={snapToGrid(30)} 
                  y2={snapToGrid(30)} 
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <line 
                  x1={snapToGrid(80)} 
                  y1={snapToGrid(20)} 
                  x2={snapToGrid(70)} 
                  y2={snapToGrid(30)} 
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <circle 
                  cx={snapToGrid(20)} 
                  cy={snapToGrid(20)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(80)} 
                  cy={snapToGrid(20)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
              </>
            )}
            
            {/* Internal shield pattern - visible only at high resolution */}
            {resolution <= 3 && (
              <path 
                d={`M ${snapToGrid(50)} ${snapToGrid(30)} 
                    L ${snapToGrid(65)} ${snapToGrid(40)} 
                    L ${snapToGrid(65)} ${snapToGrid(60)}
                    L ${snapToGrid(50)} ${snapToGrid(70)}
                    L ${snapToGrid(35)} ${snapToGrid(60)}
                    L ${snapToGrid(35)} ${snapToGrid(40)} Z`}
                fill="none"
                stroke={mainColor}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            )}
          </g>
        );
        
      case 'card-verification':
        return (
          <g>
            {/* Credit card outline */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(30)} 
              width={snapToGrid(60)} 
              height={snapToGrid(40)} 
              rx={snapToGrid(2)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1.5 : 3}
            />
            
            {/* Card stripe */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(40)} 
              width={snapToGrid(60)} 
              height={snapToGrid(8)} 
              fill={mainColor}
              fillOpacity="0.3"
            />
            
            {/* Card number details */}
            {resolution <= 3 && (
              <>
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(55)} 
                  width={snapToGrid(50)} 
                  height={snapToGrid(5)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray="3 2"
                />
                
                {/* Card chip */}
                <rect 
                  x={snapToGrid(30)} 
                  y={snapToGrid(30)} 
                  width={snapToGrid(10)} 
                  height={snapToGrid(7)} 
                  rx={snapToGrid(1)}
                  fill="none" 
                  stroke={mainColor}
                  strokeWidth={1}
                />
              </>
            )}
            
            {/* Verification scan element */}
            <circle 
              cx={snapToGrid(75)} 
              cy={snapToGrid(45)} 
              r={snapToGrid(10)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Scan lines - only visible at higher resolutions */}
            {resolution <= 3 && (
              <>
                <line 
                  x1={snapToGrid(65)} 
                  y1={snapToGrid(45)} 
                  x2={snapToGrid(85)} 
                  y2={snapToGrid(45)} 
                  stroke={mainColor}
                  strokeDasharray="2 1"
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(75)} 
                  y1={snapToGrid(35)} 
                  x2={snapToGrid(75)} 
                  y2={snapToGrid(55)} 
                  stroke={mainColor}
                  strokeDasharray="2 1"
                  strokeWidth={1}
                />
                
                {/* Check mark for verification */}
                <path
                  d={`M ${snapToGrid(70)} ${snapToGrid(45)}
                      L ${snapToGrid(73)} ${snapToGrid(50)}
                      L ${snapToGrid(80)} ${snapToGrid(40)}`}
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={resolution === 1 ? 1 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </g>
        );
        
      case 'website-optimization':
        return (
          <g>
            {/* Browser window */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(20)} 
              width={snapToGrid(60)} 
              height={snapToGrid(50)} 
              rx={snapToGrid(2)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1.5 : 3}
            />
            
            {/* Browser header */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(20)} 
              width={snapToGrid(60)} 
              height={snapToGrid(8)} 
              rx={snapToGrid(2)} 
              fill={mainColor}
              fillOpacity="0.3"
            />
            
            {/* Browser buttons */}
            {resolution <= 4 && (
              <>
                <circle 
                  cx={snapToGrid(25)} 
                  cy={snapToGrid(24)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(32)} 
                  cy={snapToGrid(24)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(39)} 
                  cy={snapToGrid(24)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
              </>
            )}
            
            {/* Website content skeleton */}
            {resolution <= 4 && (
              <>
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(35)} 
                  width={snapToGrid(50)} 
                  height={snapToGrid(6)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                />
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(45)} 
                  width={snapToGrid(40)} 
                  height={snapToGrid(6)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                />
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(55)} 
                  width={snapToGrid(30)} 
                  height={snapToGrid(6)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                />
              </>
            )}
            
            {/* Speed/optimization indicators */}
            {resolution <= 3 && (
              <>
                {/* Speed gauge */}
                <circle 
                  cx={snapToGrid(75)} 
                  cy={snapToGrid(65)} 
                  r={snapToGrid(10)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray={resolution === 1 ? "3 2" : "5 3"}
                />
                
                {/* Gauge needle */}
                <line
                  x1={snapToGrid(75)}
                  y1={snapToGrid(65)}
                  x2={snapToGrid(75 + 8)}
                  y2={snapToGrid(65 - 6)}
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeLinecap="round"
                />
                
                {/* Lightning bolt for speed */}
                <path
                  d={`M ${snapToGrid(83)} ${snapToGrid(45)}
                      L ${snapToGrid(76)} ${snapToGrid(55)}
                      L ${snapToGrid(80)} ${snapToGrid(55)}
                      L ${snapToGrid(73)} ${snapToGrid(65)}`}
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </g>
        );
        
      case 'community-platform':
        return (
          <g>
            {/* Network of connected nodes */}
            <circle 
              cx={snapToGrid(50)} 
              cy={snapToGrid(50)} 
              r={snapToGrid(8)} 
              fill={mainColor}
              fillOpacity="0.3"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1.5 : 3}
            />
            
            <circle 
              cx={snapToGrid(30)} 
              cy={snapToGrid(30)} 
              r={snapToGrid(6)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(70)} 
              cy={snapToGrid(30)} 
              r={snapToGrid(6)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(30)} 
              cy={snapToGrid(70)} 
              r={snapToGrid(6)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(70)} 
              cy={snapToGrid(70)} 
              r={snapToGrid(6)} 
              fill="none"
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Connection lines */}
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(30)} 
              y2={snapToGrid(30)} 
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 1.5}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(70)} 
              y2={snapToGrid(30)} 
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 1.5}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(30)} 
              y2={snapToGrid(70)} 
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 1.5}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(70)} 
              y2={snapToGrid(70)} 
              stroke={mainColor}
              strokeWidth={resolution === 1 ? 1 : 1.5}
            />
            
            {/* Extra nodes at higher resolutions */}
            {resolution <= 3 && (
              <>
                <circle 
                  cx={snapToGrid(50)} 
                  cy={snapToGrid(25)} 
                  r={snapToGrid(4)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(50)} 
                  x2={snapToGrid(50)} 
                  y2={snapToGrid(25)} 
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                
                <circle 
                  cx={snapToGrid(50)} 
                  cy={snapToGrid(75)} 
                  r={snapToGrid(4)} 
                  fill="none"
                  stroke={mainColor}
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(50)} 
                  x2={snapToGrid(50)} 
                  y2={snapToGrid(75)} 
                  stroke={mainColor}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                
                {/* People icons in nodes */}
                <circle 
                  cx={snapToGrid(30)} 
                  cy={snapToGrid(30)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(70)} 
                  cy={snapToGrid(30)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(30)} 
                  cy={snapToGrid(70)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
                <circle 
                  cx={snapToGrid(70)} 
                  cy={snapToGrid(70)} 
                  r={snapToGrid(2)} 
                  fill={mainColor}
                />
              </>
            )}
          </g>
        );
    }
  };
  
  // Memoize the rendered artwork to prevent unnecessary re-renders
  const artworkToRender = useMemo(() => renderArtwork(), [
    type, resolution, snapToGrid, mainColor
  ]);
  
  return (
    <div 
      className={`relative overflow-hidden w-full h-full ${className}`}
    >
      <svg 
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          backgroundColor: 'transparent',
          willChange: isVisible ? 'transform' : 'auto' // Performance hint for browsers
        }}
      >
        {/* Background grid pattern */}
        <rect 
          width="100%" 
          height="100%" 
          fill="#0A192F" 
        />
        
        {artworkToRender}
      </svg>
    </div>
  );
};

export default ProjectArtwork;