import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';
import { useParallax } from '../hooks/useParallax';

/**
 * GridPattern - Creates a subtle grid pattern with animated lines
 * similar to Stripe's background elements
 * with parallax effects on scroll
 */
const GridPattern: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  
  // Use subtle parallax for grid - slower movement creates depth effect
  const gridParallax = useParallax(0.15);
  
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
        ? 'rgba(100, 255, 218, 0.08)' 
        : 'rgba(30, 64, 175, 0.08)';
      
      const highlightColor = theme === 'dark'
        ? 'rgba(255, 183, 77, 0.15)'
        : 'rgba(100, 255, 218, 0.15)';
      
      // Draw the grid with parallax offset
      drawGrid(ctx, gridSize, lineColor, lineWidth, gridParallax);
      
      // Draw animated pulse lines with parallax
      drawPulseLines(ctx, offset, gridSize, highlightColor, gridParallax);
      
      // Update offset for animation (slower)
      offset += 0.05; // 4x slower
      if (offset > gridSize * 2) offset = 0;
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Grid drawing function with parallax
    const drawGrid = (
      ctx: CanvasRenderingContext2D, 
      size: number, 
      color: string, 
      width: number,
      parallaxOffset: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      
      // Calculate offset for parallax effect
      const yOffset = parallaxOffset % size; // Keep offset within grid size
      
      // Draw vertical lines - with subtle x parallax effect
      for (let x = 0; x <= canvas.width; x += size) {
        // Add slight horizontal shift based on grid position
        const xPos = x + (Math.sin(x * 0.01) * parallaxOffset * 0.05);
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, canvas.height);
      }
      
      // Draw horizontal lines - with y parallax effect
      for (let y = -size; y <= canvas.height + size; y += size) {
        // Apply direct y-parallax
        const yPos = (y + yOffset) % (canvas.height + size * 2);
        ctx.moveTo(0, yPos);
        ctx.lineTo(canvas.width, yPos);
      }
      
      ctx.stroke();
    };
    
    // Draw animated pulse lines with parallax
    const drawPulseLines = (
      ctx: CanvasRenderingContext2D,
      offset: number,
      size: number,
      color: string,
      parallaxOffset: number
    ) => {
      // Vertical pulse line - add subtle parallax effect
      let x = (Math.floor(offset / size) * size) % (window.innerWidth + size);
      // Add a subtle horizontal shift based on parallax
      x += (parallaxOffset * 0.1) % size;
      
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
      
      // Horizontal pulse line - with more pronounced parallax effect
      let y = (Math.floor((offset + size * 0.5) / size) * size) % (window.innerHeight + size);
      // Adjust vertical position with parallax
      y = (y + parallaxOffset * 0.2) % (window.innerHeight + size);
      
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
  }, [theme, gridParallax]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default GridPattern;