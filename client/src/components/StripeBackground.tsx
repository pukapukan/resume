import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';

/**
 * StripeBackground - Creates a background effect inspired by Stripe.com
 * with animated gradient blobs that move subtly across the screen
 */
const StripeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const isInitializedRef = useRef(false);
  const [isAnimationStable, setIsAnimationStable] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let blobs: Blob[] = [];
    
    // Set canvas dimensions to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate blobs on resize for better coverage
      initBlobs();
    };
    
    // Track scroll position with enhanced safeguards for mobile overscroll
    const handleScroll = () => {
      // Only update the target scroll position, not the actual one used for rendering
      // Enhanced safeguard for overscroll on mobile and initial load
      const newScrollY = Math.max(0, window.scrollY);
      
      // Limit scroll change rate for initial viewport
      // This prevents large jumps during initial load and bounce effects
      if (!isAnimationStable) {
        if (Math.abs(targetScrollYRef.current - newScrollY) > 50) {
          targetScrollYRef.current += (newScrollY - targetScrollYRef.current) * 0.1;
        } else {
          targetScrollYRef.current = newScrollY;
        }
      } else {
        targetScrollYRef.current = newScrollY;
      }
    };
    
    // Create initial blobs
    const initBlobs = () => {
      // Clear existing blobs
      blobs = [];
      
      // Colors for light and dark themes
      const colors = theme === 'dark' 
        ? ['rgba(100, 255, 218, 0.18)', 'rgba(255, 183, 77, 0.18)', 'rgba(30, 64, 175, 0.18)']
        : ['rgba(64, 175, 255, 0.18)', 'rgba(255, 183, 77, 0.18)', 'rgba(100, 255, 218, 0.18)'];
      
      // Create between 3-5 blobs
      const numBlobs = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numBlobs; i++) {
        blobs.push(new Blob(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 300 + 200, // size between 200-500
          colors[i % colors.length],
          Math.random() * 0.0003 - 0.00015, // increased x velocity for more noticeable animation
          Math.random() * 0.0003 - 0.00015  // increased y velocity for more noticeable animation
        ));
      }
      
      // Initial synchronization of scroll values to avoid jumps
      scrollYRef.current = Math.max(0, window.scrollY);
      targetScrollYRef.current = scrollYRef.current;
      
      // Update all blobs to match the initial scroll position
      // This prevents the blobs from animating to their positions on load
      blobs.forEach(blob => {
        const scrollFactor = 0.03; // Must match the factor in the update method
        const scrollOffset = scrollYRef.current * scrollFactor;
        blob.y = blob.origY - scrollOffset;
        blob.targetY = blob.y;
      });
    };
    
    // Helper function for smooth interpolation
    const lerp = (start: number, end: number, t: number) => {
      return start * (1 - t) + end * t;
    };
    
    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smooth scroll transition using lerp with adaptive smoothing
      const smoothingFactor = isAnimationStable ? 0.05 : 0.1;
      
      scrollYRef.current = lerp(
        scrollYRef.current, 
        targetScrollYRef.current, 
        smoothingFactor
      );
      
      // Only start interpolating once we have a stable reference
      if (isInitializedRef.current) {
        // Update and draw each blob
        blobs.forEach(blob => {
          blob.update(timestamp, canvas.width, canvas.height, scrollYRef.current, isAnimationStable);
          blob.draw(ctx);
        });
      } else {
        // For the very first few frames, just draw without updating
        // This prevents the initial jump when the component loads
        blobs.forEach(blob => {
          blob.draw(ctx);
        });
        
        // Mark as initialized after first frame
        isInitializedRef.current = true;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Run initial setup
    handleResize();
    
    // Set initial scroll position from current page state
    handleScroll();
    
    // Start animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Add a delay to match the page animations and allow everything to stabilize
    const stabilizeTimer = setTimeout(() => {
      setIsAnimationStable(true);
    }, 1000); // Longer delay to ensure page has fully loaded
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(stabilizeTimer);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};

// Blob class to manage each animated gradient shape
class Blob {
  x: number;
  y: number;
  origX: number;
  origY: number;
  targetY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  lastUpdate: number;
  
  constructor(x: number, y: number, size: number, color: string, vx: number, vy: number) {
    this.x = this.origX = x;
    this.y = this.origY = y;
    this.targetY = y;
    this.size = size;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = 0;
    this.lastUpdate = 0;
  }
  
  update(timestamp: number, canvasWidth: number, canvasHeight: number, scrollY: number, isStable: boolean) {
    // Constants for velocity management
    const maxVelocity = isStable ? 0.0002 : 0.0001; // Reduced velocity during initial load
    const minVelocity = 0.00005;
    const baseTime = 16; // Base time step (roughly 60fps)
    
    // Calculate a normalized time delta to make movement frame-rate independent
    // This prevents acceleration based on timestamp increases
    const deltaTime = Math.min(30, timestamp - (this.lastUpdate || timestamp - baseTime)) || baseTime;
    
    // Reduce horizontal movement during stabilization period
    const speedReductionFactor = isStable ? 1.0 : 0.5;
    
    // Update position with normalized time and reduced speed during initial load
    this.x += this.vx * deltaTime * speedReductionFactor;
    
    // Set target position based on scroll - subtle parallax effect
    // Use a much smaller multiplier to make the effect very subtle
    this.targetY = this.origY - scrollY * 0.03;
    
    // Smooth transition to target Y with adaptive smoothing
    const smoothingFactor = isStable ? 0.05 : 0.02;
    this.y = this.y + (this.targetY - this.y) * smoothingFactor;
    
    // Reduced rotation speed during initial load
    if (timestamp - this.lastUpdate > 100) { // Less frequent updates
      this.angle += isStable ? 0.001 : 0.0005; // Slower rotation initially
    }
    
    // Bounce off edges with a little randomness
    if (this.x < -this.size/2 || this.x > canvasWidth + this.size/2) {
      this.vx *= -1;
      // Add smaller randomness during stabilization
      if (isStable) {
        this.vx += (Math.random() * 0.00002 - 0.00001);
      }
    }
    
    // Bounce off top and bottom using the target Y
    if (this.targetY < -this.size/2 || this.targetY > canvasHeight + this.size/2) {
      this.vy *= -1;
      // Add smaller randomness during stabilization
      if (isStable) {
        this.vy += (Math.random() * 0.00002 - 0.00001);
      }
    }
    
    // Add natural deceleration/oscillation effect (only when stable)
    if (isStable) {
      const oscillationFactor = Math.sin(timestamp * 0.0002) * 0.2;
      
      // Apply stronger oscillation to velocity (speed up and slow down more noticeably)
      this.vx *= (1 + oscillationFactor * 0.02);
      this.vy *= (1 + oscillationFactor * 0.02);
    }
    
    // Strictly enforce velocity limits
    this.vx = Math.max(Math.min(this.vx, maxVelocity), -maxVelocity);
    this.vy = Math.max(Math.min(this.vy, maxVelocity), -maxVelocity);
    
    // Ensure minimum velocity
    if (Math.abs(this.vx) < minVelocity) {
      this.vx = minVelocity * Math.sign(this.vx || 1);
    }
    
    if (Math.abs(this.vy) < minVelocity) {
      this.vy = minVelocity * Math.sign(this.vy || 1);
    }
    
    // Update lastUpdate for time delta calculations
    this.lastUpdate = timestamp;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Move to center of blob
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Create a radial gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    
    // Draw blob as a circle with gradient
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.restore();
  }
}

export default StripeBackground;