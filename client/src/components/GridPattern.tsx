import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';

/**
 * GridPattern - Creates a subtle grid pattern with animated lines
 * similar to Stripe's background elements
 */
const GridPattern: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions to match window
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      ctx.scale(dpr, dpr);
    };
    
    // Animation parameters
    let offset = 0;
    const gridSize = 40;
    const lineWidth = 0.5;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Colors based on theme
      const lineColor = theme === 'dark' 
        ? 'rgba(100, 255, 218, 0.1)' 
        : 'rgba(30, 64, 175, 0.1)';
      
      const highlightColor = theme === 'dark'
        ? 'rgba(255, 183, 77, 0.18)'
        : 'rgba(100, 255, 218, 0.18)';
      
      // Draw the grid
      drawGrid(ctx, gridSize, lineColor, lineWidth);
      
      // Draw animated pulse lines
      drawPulseLines(ctx, offset, gridSize, highlightColor);
      
      // Update offset for animation (slower)
      offset += 0.05; // 4x slower
      if (offset > gridSize * 2) offset = 0;
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Grid drawing function
    const drawGrid = (
      ctx: CanvasRenderingContext2D, 
      size: number, 
      color: string, 
      width: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      
      ctx.stroke();
    };
    
    // Draw animated pulse lines
    const drawPulseLines = (
      ctx: CanvasRenderingContext2D,
      offset: number,
      size: number,
      color: string
    ) => {
      // Vertical pulse line
      const x = (Math.floor(offset / size) * size) % (window.innerWidth + size);
      
      const gradient = ctx.createLinearGradient(x - 10, 0, x + 10, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      // Horizontal pulse line - offset by half the animation
      const y = (Math.floor((offset + size * 0.5) / size) * size) % (window.innerHeight + size);
      
      const gradient2 = ctx.createLinearGradient(0, y - 10, 0, y + 10);
      gradient2.addColorStop(0, 'transparent');
      gradient2.addColorStop(0.5, color);
      gradient2.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.strokeStyle = gradient2;
      ctx.lineWidth = 1;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default GridPattern;