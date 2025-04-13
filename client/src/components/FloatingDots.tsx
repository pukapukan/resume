import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';

/**
 * FloatingDots - Creates subtle floating dot particles
 * that react to scroll position and move gently across the screen
 */
const FloatingDots: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);
  // Add a separate target scroll value for smooth transitions
  const targetScrollYRef = useRef(0);
  const lastTimeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    // Track scroll position with safeguards for mobile overscroll
    const handleScroll = () => {
      // Only update the target scroll position, not the actual one used for rendering
      // Ensure scrollY is never negative, which can happen with overscroll on mobile
      targetScrollYRef.current = Math.max(0, window.scrollY);
    };
    
    // Initialize dots
    const initDots = () => {
      const dotCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 25000), 100);
      dotsRef.current = [];
      
      for (let i = 0; i < dotCount; i++) {
        dotsRef.current.push(new Dot(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 2 + 1,
          theme === 'dark' ? 
            `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${0.15 + Math.random() * 0.45})` : 
            `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${0.15 + Math.random() * 0.45})`
        ));
      }
    };
    
    // Animation loop with timestamp for consistent animation
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate time delta for smooth animations
      const deltaTime = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;
      
      // Smooth scroll transition using lerp (linear interpolation)
      scrollYRef.current = lerp(
        scrollYRef.current, 
        targetScrollYRef.current, 
        Math.min(1, deltaTime * 0.003) // Adjust this value to control smoothness
      );
      
      // Update and draw dots with timestamp
      dotsRef.current.forEach(dot => {
        dot.update(mouseRef.current, scrollYRef.current, canvas.width, canvas.height, timestamp, deltaTime);
        dot.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    animate(performance.now());
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  // When theme changes, update dot colors
  useEffect(() => {
    if (!canvasRef.current) return;
    
    dotsRef.current.forEach(dot => {
      dot.color = theme === 'dark' ? 
        `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${0.15 + Math.random() * 0.45})` : 
        `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${0.15 + Math.random() * 0.45})`;
    });
  }, [theme]);
  
  // Helper function for smooth interpolation
  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

class Dot {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  origX: number;
  origY: number;
  targetY: number; // Add a target Y position for smooth transitions
  lastUpdate: number;
  
  constructor(x: number, y: number, size: number, color: string) {
    this.x = this.origX = x;
    this.y = this.origY = y;
    this.targetY = y; // Initialize target to current position
    this.size = size;
    this.color = color;
    this.lastUpdate = 0;
    
    // Random velocity (extremely slow)
    this.vx = Math.random() * 0.05 - 0.025; // 4x slower
    this.vy = Math.random() * 0.05 - 0.025; // 4x slower
  }
  
  update(mouse: { x: number, y: number }, scrollY: number, width: number, height: number, timestamp: number, deltaTime: number) {
    // Calculate a normalized time delta to make movement frame-rate independent
    const baseTime = 16; // Base time step (roughly 60fps)
    const normalizedDelta = Math.min(deltaTime, 32) || baseTime;
    
    // Apply tiny base movement with time delta normalization
    this.x += this.vx * normalizedDelta;
    
    // Set target position based on scroll - reduces the scroll effect by 60%
    // This dramatically reduces the visible jumping effect
    this.targetY = this.origY - scrollY * 0.04; // Reduced from 0.1
    
    // Smoothly interpolate to the target Y position
    this.y = this.y + (this.targetY - this.y) * 0.05; // Adjust 0.05 to control smoothness
    
    // React slightly to mouse - only if mouse is close
    const mouseDistance = Math.sqrt(
      Math.pow(mouse.x - this.x, 2) + 
      Math.pow(mouse.y - this.y, 2)
    );
    
    const mouseInfluenceRadius = 200;
    
    if (mouseDistance < mouseInfluenceRadius) {
      const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
      const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
      
      // Move away from mouse (even more subtle effect)
      this.x -= Math.cos(angle) * force * 0.2 * (normalizedDelta / baseTime); // Time-normalized
      this.y -= Math.sin(angle) * force * 0.2 * (normalizedDelta / baseTime); // Time-normalized
    }
    
    // Wrap around edges with a buffer
    const buffer = 50;
    
    if (this.x < -buffer) this.x = width + buffer;
    if (this.x > width + buffer) this.x = -buffer;
    if (this.y < -buffer) this.y = height + buffer;
    if (this.y > height + buffer) this.y = -buffer;
    
    // Update last update timestamp
    this.lastUpdate = timestamp;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export default FloatingDots;