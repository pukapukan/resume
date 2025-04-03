import { useEffect, useRef, useState } from "react";

// Types of pixel art to render
type ArtworkType = 'fraud-system' | 'card-verification' | 'website-optimization' | 'community-platform';

interface ProjectArtworkProps {
  type: ArtworkType;
  className?: string;
  inView: boolean;
}

// Color palette inspired by retro computer graphics
const colors = {
  primary: '#64FFDA',  // Teal
  secondary: '#FFB74D', // Orange
  accent1: '#9D4EDD',  // Purple
  accent2: '#4CC9F0',  // Blue
  dark: '#0A192F',     // Dark blue background
  light: '#E6F1FF',    // Light text color
  grid: 'rgba(100, 255, 218, 0.2)' // Grid lines
};

/**
 * ProjectArtwork - Renders SVG-based pixel art drawings for project cards
 * with a resolution transition effect similar to Gates Notes
 */
const ProjectArtwork = ({ type, className = '', inView }: ProjectArtworkProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [resolution, setResolution] = useState(6); // Start with low resolution (higher number = fewer pixels)
  
  // Increase resolution when component comes into view
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        // Animate to higher resolution in steps
        const interval = setInterval(() => {
          setResolution(prev => {
            const newValue = prev - 1;
            if (newValue <= 1) {
              clearInterval(interval);
              return 1; // Full resolution
            }
            return newValue;
          });
        }, 150); // Speed of resolution increase
        
        return () => clearInterval(interval);
      }, 300); // Delay before starting animation
      
      return () => clearTimeout(timer);
    } else {
      // Reset to low resolution when out of view
      setResolution(6);
    }
  }, [inView]);
  
  // Generate grid pattern based on resolution
  const gridSize = resolution * 2; // Grid cell size
  const gridPattern = () => {
    const patternSize = 100;
    const lines = [];
    
    // Create grid lines
    for (let i = 0; i <= patternSize; i += gridSize) {
      // Horizontal lines
      lines.push(
        <line 
          key={`h-${i}`} 
          x1="0" 
          y1={i} 
          x2={patternSize} 
          y2={i} 
          stroke={colors.grid} 
          strokeWidth="0.5" 
        />
      );
      
      // Vertical lines
      lines.push(
        <line 
          key={`v-${i}`} 
          x1={i} 
          y1="0" 
          x2={i} 
          y2={patternSize} 
          stroke={colors.grid} 
          strokeWidth="0.5" 
        />
      );
    }
    
    return (
      <pattern 
        id="grid-pattern" 
        width={gridSize} 
        height={gridSize} 
        patternUnits="userSpaceOnUse"
      >
        <rect width={gridSize} height={gridSize} fill="none" />
        {resolution <= 2 && lines} {/* Only show grid at higher resolutions */}
      </pattern>
    );
  };
  
  // Round coordinates to grid
  const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;
  
  // Render different artwork based on type
  const renderArtwork = () => {
    switch (type) {
      case 'fraud-system':
        return (
          <>
            <defs>
              {gridPattern()}
              <linearGradient id="fraud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colors.accent2} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            
            {/* Shield shape */}
            <path 
              d={`M ${snapToGrid(50)} ${snapToGrid(20)} 
                  L ${snapToGrid(80)} ${snapToGrid(35)} 
                  L ${snapToGrid(80)} ${snapToGrid(65)}
                  L ${snapToGrid(50)} ${snapToGrid(80)}
                  L ${snapToGrid(20)} ${snapToGrid(65)}
                  L ${snapToGrid(20)} ${snapToGrid(35)} Z`}
              fill="url(#fraud-gradient)"
              stroke={colors.primary}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Lock icon */}
            <rect 
              x={snapToGrid(40)} 
              y={snapToGrid(45)} 
              width={snapToGrid(20)} 
              height={snapToGrid(20)} 
              rx={snapToGrid(2)} 
              fill={colors.dark}
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(50)} 
              cy={snapToGrid(45)} 
              r={snapToGrid(8)} 
              fill="none"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Connection lines for fraud network */}
            {resolution <= 3 && (
              <>
                <line 
                  x1={snapToGrid(20)} 
                  y1={snapToGrid(20)} 
                  x2={snapToGrid(30)} 
                  y2={snapToGrid(30)} 
                  stroke={colors.secondary}
                  strokeWidth={resolution === 1 ? 1 : 2}
                />
                <line 
                  x1={snapToGrid(80)} 
                  y1={snapToGrid(20)} 
                  x2={snapToGrid(70)} 
                  y2={snapToGrid(30)} 
                  stroke={colors.accent1}
                  strokeWidth={resolution === 1 ? 1 : 2}
                />
                <circle 
                  cx={snapToGrid(20)} 
                  cy={snapToGrid(20)} 
                  r={snapToGrid(2)} 
                  fill={colors.secondary}
                />
                <circle 
                  cx={snapToGrid(80)} 
                  cy={snapToGrid(20)} 
                  r={snapToGrid(2)} 
                  fill={colors.accent1}
                />
              </>
            )}
          </>
        );
        
      case 'card-verification':
        return (
          <>
            <defs>
              {gridPattern()}
              <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.accent1} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colors.primary} stopOpacity="0.7" />
              </linearGradient>
            </defs>
            
            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            
            {/* Credit card */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(30)} 
              width={snapToGrid(60)} 
              height={snapToGrid(40)} 
              rx={snapToGrid(4)} 
              fill="url(#card-gradient)"
              stroke={colors.primary}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Card details */}
            {resolution <= 4 && (
              <>
                <rect 
                  x={snapToGrid(26)} 
                  y={snapToGrid(40)} 
                  width={snapToGrid(40)} 
                  height={snapToGrid(6)} 
                  fill={colors.dark}
                  stroke={colors.light}
                  strokeWidth={1}
                />
                <rect 
                  x={snapToGrid(26)} 
                  y={snapToGrid(50)} 
                  width={snapToGrid(14)} 
                  height={snapToGrid(6)} 
                  fill={colors.dark}
                  stroke={colors.light}
                  strokeWidth={1}
                />
              </>
            )}
            
            {/* Camera/scan icon */}
            <circle 
              cx={snapToGrid(75)} 
              cy={snapToGrid(35)} 
              r={snapToGrid(8)} 
              fill={colors.dark}
              stroke={colors.secondary}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Scan lines */}
            {resolution <= 3 && (
              <>
                <line 
                  x1={snapToGrid(75)} 
                  y1={snapToGrid(30)} 
                  x2={snapToGrid(75)} 
                  y2={snapToGrid(80)} 
                  stroke={colors.secondary}
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(60)} 
                  x2={snapToGrid(90)} 
                  y2={snapToGrid(60)} 
                  stroke={colors.secondary}
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
              </>
            )}
          </>
        );
        
      case 'website-optimization':
        return (
          <>
            <defs>
              {gridPattern()}
              <linearGradient id="speed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.accent2} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colors.primary} stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            
            {/* Browser window */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(20)} 
              width={snapToGrid(60)} 
              height={snapToGrid(50)} 
              rx={snapToGrid(2)} 
              fill={colors.dark}
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Browser header */}
            <rect 
              x={snapToGrid(20)} 
              y={snapToGrid(20)} 
              width={snapToGrid(60)} 
              height={snapToGrid(8)} 
              rx={snapToGrid(2)} 
              fill={colors.accent2}
              stroke="none"
            />
            
            {/* Speed lines */}
            {resolution <= 3 && (
              <>
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(90)} 
                  x2={snapToGrid(90)} 
                  y2={snapToGrid(50)} 
                  stroke="url(#speed-gradient)"
                  strokeWidth={gridSize}
                  strokeLinecap="round"
                />
                <line 
                  x1={snapToGrid(40)} 
                  y1={snapToGrid(90)} 
                  x2={snapToGrid(90)} 
                  y2={snapToGrid(40)} 
                  stroke="url(#speed-gradient)"
                  strokeWidth={gridSize}
                  strokeLinecap="round"
                />
                <line 
                  x1={snapToGrid(30)} 
                  y1={snapToGrid(90)} 
                  x2={snapToGrid(90)} 
                  y2={snapToGrid(30)} 
                  stroke="url(#speed-gradient)"
                  strokeWidth={gridSize}
                  strokeLinecap="round"
                />
              </>
            )}
            
            {/* Simplified website content at higher resolutions */}
            {resolution <= 4 && (
              <>
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(35)} 
                  width={snapToGrid(50)} 
                  height={snapToGrid(6)} 
                  fill={colors.light}
                  opacity="0.7"
                />
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(45)} 
                  width={snapToGrid(40)} 
                  height={snapToGrid(6)} 
                  fill={colors.light}
                  opacity="0.5"
                />
                <rect 
                  x={snapToGrid(25)} 
                  y={snapToGrid(55)} 
                  width={snapToGrid(30)} 
                  height={snapToGrid(6)} 
                  fill={colors.light}
                  opacity="0.3"
                />
              </>
            )}
            
            {/* Speedometer */}
            {resolution <= 3 && (
              <circle 
                cx={snapToGrid(80)} 
                cy={snapToGrid(75)} 
                r={snapToGrid(10)} 
                fill="none"
                stroke={colors.secondary}
                strokeWidth={resolution === 1 ? 1 : 2}
                strokeDasharray={resolution === 1 ? "3 2" : "5 3"}
              />
            )}
          </>
        );
        
      case 'community-platform':
        return (
          <>
            <defs>
              {gridPattern()}
              <linearGradient id="community-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.accent1} stopOpacity="0.6" />
                <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.7" />
              </linearGradient>
            </defs>
            
            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            
            {/* Network of connected nodes */}
            <circle 
              cx={snapToGrid(50)} 
              cy={snapToGrid(50)} 
              r={snapToGrid(12)} 
              fill="url(#community-gradient)"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(30)} 
              cy={snapToGrid(30)} 
              r={snapToGrid(8)} 
              fill="url(#community-gradient)"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(70)} 
              cy={snapToGrid(30)} 
              r={snapToGrid(8)} 
              fill="url(#community-gradient)"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(30)} 
              cy={snapToGrid(70)} 
              r={snapToGrid(8)} 
              fill="url(#community-gradient)"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            <circle 
              cx={snapToGrid(70)} 
              cy={snapToGrid(70)} 
              r={snapToGrid(8)} 
              fill="url(#community-gradient)"
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
            />
            
            {/* Connection lines */}
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(30)} 
              y2={snapToGrid(30)} 
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
              strokeDasharray={resolution <= 2 ? "0" : "4 4"}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(70)} 
              y2={snapToGrid(30)} 
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
              strokeDasharray={resolution <= 2 ? "0" : "4 4"}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(30)} 
              y2={snapToGrid(70)} 
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
              strokeDasharray={resolution <= 2 ? "0" : "4 4"}
            />
            
            <line 
              x1={snapToGrid(50)} 
              y1={snapToGrid(50)} 
              x2={snapToGrid(70)} 
              y2={snapToGrid(70)} 
              stroke={colors.light}
              strokeWidth={resolution === 1 ? 1 : 2}
              strokeDasharray={resolution <= 2 ? "0" : "4 4"}
            />
            
            {/* Extra details at higher resolutions */}
            {resolution <= 3 && (
              <>
                <circle 
                  cx={snapToGrid(50)} 
                  cy={snapToGrid(25)} 
                  r={snapToGrid(5)} 
                  fill="url(#community-gradient)"
                  stroke={colors.light}
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(50)} 
                  x2={snapToGrid(50)} 
                  y2={snapToGrid(25)} 
                  stroke={colors.light}
                  strokeWidth={1}
                  strokeDasharray={resolution <= 2 ? "0" : "2 2"}
                />
                <circle 
                  cx={snapToGrid(50)} 
                  cy={snapToGrid(75)} 
                  r={snapToGrid(5)} 
                  fill="url(#community-gradient)"
                  stroke={colors.light}
                  strokeWidth={1}
                />
                <line 
                  x1={snapToGrid(50)} 
                  y1={snapToGrid(50)} 
                  x2={snapToGrid(50)} 
                  y2={snapToGrid(75)} 
                  stroke={colors.light}
                  strokeWidth={1}
                  strokeDasharray={resolution <= 2 ? "0" : "2 2"}
                />
              </>
            )}
          </>
        );
    }
  };
  
  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <svg 
        ref={svgRef}
        className={`w-full h-full ${inView ? 'animate-resolution' : ''}`}
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
      >
        {renderArtwork()}
      </svg>
    </div>
  );
};

export default ProjectArtwork;