import React, { useEffect, useRef, useState } from 'react';
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
  const targetScrollYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isInitializedRef = useRef(false);
  const [isAnimationStable, setIsAnimationStable] = useState(false);
  
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
    
    // Track scroll position with enhanced safeguards for mobile overscroll
    // Special handling for Safari's elastic scrolling behavior
    const handleScroll = () => {
      // Only update the target scroll position, not the actual one used for rendering
      // Enhanced safeguard for overscroll on mobile and initial load
      const newScrollY = Math.max(0, window.scrollY);
      
      // Safari-specific check - detect very rapid scroll changes that indicate elastic scrolling
      const scrollChange = Math.abs(targetScrollYRef.current - newScrollY);
      const isSafariElasticScroll = scrollChange > 30 && newScrollY < 100;
      
      // Special case for Safari's elastic overscroll in the top viewport area
      if (isSafariElasticScroll) {
        // Use extremely gradual changes during elastic scrolling in Safari
        targetScrollYRef.current += (newScrollY - targetScrollYRef.current) * 0.05;
        return; // Exit early to prevent jumps
      }
      
      // Regular scroll handling with stabilization logic
      if (!isAnimationStable) {
        if (scrollChange > 20) {
          // Even more damped response during initial load
          targetScrollYRef.current += (newScrollY - targetScrollYRef.current) * 0.08;
        } else {
          targetScrollYRef.current = newScrollY;
        }
      } else {
        targetScrollYRef.current = newScrollY;
      }
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
      
      // Initial synchronization of scroll values to avoid jumps
      scrollYRef.current = Math.max(0, window.scrollY);
      targetScrollYRef.current = scrollYRef.current;
      
      // Update all dots to match the initial scroll position
      // This prevents the dots from animating to their positions on load
      dotsRef.current.forEach(dot => {
        const scrollFactor = 0.04; // Must match the factor in the update method
        const scrollOffset = scrollYRef.current * scrollFactor;
        dot.y = dot.origY - scrollOffset;
        dot.targetY = dot.y;
      });
    };
    
    // Animation loop with timestamp for consistent animation
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate time delta for smooth animations
      const deltaTime = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;
      
      // Smooth scroll transition using lerp (linear interpolation)
      // Use a more aggressive smoothing for the first seconds after load
      const smoothingFactor = isAnimationStable ? 0.06 : 0.12;
      
      scrollYRef.current = lerp(
        scrollYRef.current, 
        targetScrollYRef.current, 
        Math.min(1, deltaTime * smoothingFactor)
      );
      
      // Only start interpolating once we have a stable reference
      if (isInitializedRef.current) {
        // Update and draw dots with timestamp
        dotsRef.current.forEach(dot => {
          dot.update(mouseRef.current, scrollYRef.current, canvas.width, canvas.height, timestamp, deltaTime, isAnimationStable);
          dot.draw(ctx);
        });
      } else {
        // For the very first few frames, just draw without updating
        // This prevents the initial jump when the component loads
        dotsRef.current.forEach(dot => {
          dot.draw(ctx);
        });
        
        // Mark as initialized after first frame
        isInitializedRef.current = true;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Run initial setup
    handleResize();
    
    // Set initial scroll position from current page state
    handleScroll();
    
    // Start animation
    animate(performance.now());
    
    // Add a delay to match the page animations and allow everything to stabilize
    const stabilizeTimer = setTimeout(() => {
      setIsAnimationStable(true);
    }, 1000); // Longer delay to ensure page has fully loaded
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(stabilizeTimer);
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
  targetY: number;
  lastUpdate: number;
  
  constructor(x: number, y: number, size: number, color: string) {
    this.x = this.origX = x;
    this.y = this.origY = y;
    this.targetY = y; // Initialize target to current position
    this.size = size;
    this.color = color;
    this.lastUpdate = 0;
    
    // Random velocity (extremely slow)
    this.vx = Math.random() * 0.03 - 0.015; // Even slower for initial load
    this.vy = Math.random() * 0.03 - 0.015; // Even slower for initial load
  }
  
  update(mouse: { x: number, y: number }, scrollY: number, width: number, height: number, timestamp: number, deltaTime: number, isStable: boolean) {
    // Calculate a normalized time delta to make movement frame-rate independent
    const baseTime = 16; // Base time step (roughly 60fps)
    const normalizedDelta = Math.min(deltaTime, 32) || baseTime;
    
    // Apply tiny base movement with time delta normalization
    // Reduce horizontal movement at the top of the page
    const speedReductionFactor = isStable ? 1.0 : 0.5;
    this.x += this.vx * normalizedDelta * speedReductionFactor;
    
    // Set target position based on scroll - reduces the scroll effect by 60%
    this.targetY = this.origY - scrollY * 0.04; // Reduced from 0.1
    
    // Smoothly interpolate to the target Y position
    // More aggressive smoothing during initial load
    const smoothingFactor = isStable ? 0.05 : 0.02;
    this.y = this.y + (this.targetY - this.y) * smoothingFactor;
    
    // React slightly to mouse - only if mouse is close and animation is stable
    if (isStable) {
      const mouseDistance = Math.sqrt(
        Math.pow(mouse.x - this.x, 2) + 
        Math.pow(mouse.y - this.y, 2)
      );
      
      const mouseInfluenceRadius = 200;
      
      if (mouseDistance < mouseInfluenceRadius) {
        const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
        
        // Move away from mouse (subtle effect)
        this.x -= Math.cos(angle) * force * 0.2 * (normalizedDelta / baseTime);
        this.y -= Math.sin(angle) * force * 0.2 * (normalizedDelta / baseTime);
      }
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