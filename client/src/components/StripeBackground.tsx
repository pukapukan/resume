import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';
import { useParallax } from '../hooks/useParallax';

/**
 * StripeBackground - Creates a background effect inspired by Stripe.com
 * with animated gradient blobs that move subtly across the screen
 * and respond to scroll with parallax effect
 */
const StripeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  const scrollRef = useRef(0);
  
  // Get parallax offset for different layers
  const parallaxSlow = useParallax(0.2); // Slow-moving background layer
  const parallaxMedium = useParallax(0.4); // Medium-speed middle layer
  const parallaxFast = useParallax(-0.1); // Fast, reverse-direction layer
  
  // Store blobs in a ref to maintain state between renders
  const blobsRef = useRef<Blob[]>([]);
  
  // Blob layer assignments
  const [blobLayers, setBlobLayers] = useState<{[id: number]: 'slow' | 'medium' | 'fast'}>({});
  
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
      
      // Regenerate blobs on resize for better coverage
      initBlobs();
    };
    
    // Track scroll position for non-CSS parallax effects
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    // Create initial blobs
    const initBlobs = () => {
      // Clear existing blobs
      blobsRef.current = [];
      const layerAssignments: {[id: number]: 'slow' | 'medium' | 'fast'} = {};
      
      // Colors for light and dark themes
      const colors = theme === 'dark' 
        ? ['rgba(100, 255, 218, 0.15)', 'rgba(255, 183, 77, 0.15)', 'rgba(30, 64, 175, 0.15)']
        : ['rgba(64, 175, 255, 0.15)', 'rgba(255, 183, 77, 0.15)', 'rgba(100, 255, 218, 0.15)'];
      
      // Create between 4-6 blobs (more for parallax layers)
      const numBlobs = Math.floor(Math.random() * 3) + 4;
      
      const layers: Array<'slow' | 'medium' | 'fast'> = ['slow', 'medium', 'fast'];
      
      for (let i = 0; i < numBlobs; i++) {
        // Assign a layer to each blob
        const layer = layers[i % layers.length];
        
        // Create the blob
        const newBlob = new Blob(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 300 + 200, // size between 200-500
          colors[i % colors.length],
          Math.random() * 0.0001 - 0.00005, // x velocity (very slow)
          Math.random() * 0.0001 - 0.00005, // y velocity (very slow)
          i // unique ID
        );
        
        blobsRef.current.push(newBlob);
        layerAssignments[i] = layer;
      }
      
      // Store layer assignments
      setBlobLayers(layerAssignments);
    };
    
    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each blob with its parallax offset
      blobsRef.current.forEach(blob => {
        // Get appropriate parallax value based on blob's layer
        let yOffset = 0;
        const layer = blobLayers[blob.id] || 'medium';
        
        switch(layer) {
          case 'slow':
            yOffset = parallaxSlow;
            break;
          case 'medium':
            yOffset = parallaxMedium;
            break;
          case 'fast':
            yOffset = parallaxFast;
            break;
        }
        
        blob.update(timestamp, canvas.width, canvas.height, yOffset);
        blob.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, parallaxSlow, parallaxMedium, parallaxFast]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

// Blob class to manage each animated gradient shape
class Blob {
  x: number;
  y: number;
  origY: number; // Original Y position for parallax reference
  size: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  lastUpdate: number;
  id: number; // Unique ID for layer assignment
  
  constructor(x: number, y: number, size: number, color: string, vx: number, vy: number, id: number = 0) {
    this.x = x;
    this.y = this.origY = y; // Store original position for parallax
    this.size = size;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = 0;
    this.lastUpdate = 0;
    this.id = id;
  }
  
  update(timestamp: number, canvasWidth: number, canvasHeight: number, parallaxOffset: number = 0) {
    // Constants for velocity management
    const maxVelocity = 0.00004; // Strict max velocity
    const minVelocity = 0.00001; // Min velocity
    const baseTime = 16; // Base time step (roughly 60fps)
    
    // Calculate a normalized time delta to make movement frame-rate independent
    // This prevents acceleration based on timestamp increases
    const deltaTime = Math.min(30, timestamp - (this.lastUpdate || timestamp - baseTime)) || baseTime;
    
    // Update position with normalized time
    this.x += this.vx * deltaTime;
    
    // Apply parallax effect - adjust position based on scroll and layer assignment
    this.y = this.origY + this.vy * deltaTime + parallaxOffset;
    
    // Very slowly rotate
    if (timestamp - this.lastUpdate > 100) { // Less frequent updates
      this.angle += 0.0005; // Much slower rotation
      // Only update lastUpdate for rotation, not for position calculation
    }
    
    // Bounce off edges with a little randomness
    if (this.x < -this.size/2 || this.x > canvasWidth + this.size/2) {
      this.vx *= -1;
      // Add smaller randomness and oscillate velocity
      this.vx += (Math.random() * 0.00002 - 0.00001);
    }
    
    // Only bounce top and bottom for base position, not parallax-adjusted position
    const baseY = this.origY + this.vy * deltaTime;
    if (baseY < -this.size/2 || baseY > canvasHeight + this.size/2) {
      this.vy *= -1;
      // Add smaller randomness and oscillate velocity
      this.vy += (Math.random() * 0.00002 - 0.00001);
      // Also update origY to avoid visual glitches
      this.origY = Math.max(-this.size/2, Math.min(canvasHeight + this.size/2, baseY));
    }
    
    // Add natural deceleration/oscillation effect
    const oscillationFactor = Math.sin(timestamp * 0.0001) * 0.1;
    
    // Apply gentle oscillation to velocity (speed up and slow down naturally)
    this.vx *= (1 + oscillationFactor * 0.01);
    this.vy *= (1 + oscillationFactor * 0.01);
    
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