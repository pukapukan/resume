import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';

/**
 * StripeBackground - Creates a background effect inspired by Stripe.com
 * with animated gradient blobs that move subtly across the screen
 */
const StripeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  
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
    };
    
    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each blob
      blobs.forEach(blob => {
        blob.update(timestamp, canvas.width, canvas.height);
        blob.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    handleResize();
    animationFrameId = requestAnimationFrame(animate);
    
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
      style={{ opacity: 0.8 }}
    />
  );
};

// Blob class to manage each animated gradient shape
class Blob {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  lastUpdate: number;
  
  constructor(x: number, y: number, size: number, color: string, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = 0;
    this.lastUpdate = 0;
  }
  
  update(timestamp: number, canvasWidth: number, canvasHeight: number) {
    // Constants for velocity management
    const maxVelocity = 0.0002; // Increased max velocity for more visible movement
    const minVelocity = 0.00005; // Increased min velocity for more visible movement
    const baseTime = 16; // Base time step (roughly 60fps)
    
    // Calculate a normalized time delta to make movement frame-rate independent
    // This prevents acceleration based on timestamp increases
    const deltaTime = Math.min(30, timestamp - (this.lastUpdate || timestamp - baseTime)) || baseTime;
    
    // Update position with normalized time
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Rotate at a moderate pace
    if (timestamp - this.lastUpdate > 100) { // Less frequent updates
      this.angle += 0.001; // Increased rotation speed for more visible movement
      // Only update lastUpdate for rotation, not for position calculation
    }
    
    // Bounce off edges with a little randomness
    if (this.x < -this.size/2 || this.x > canvasWidth + this.size/2) {
      this.vx *= -1;
      // Add smaller randomness and oscillate velocity
      this.vx += (Math.random() * 0.00002 - 0.00001);
    }
    
    if (this.y < -this.size/2 || this.y > canvasHeight + this.size/2) {
      this.vy *= -1;
      // Add smaller randomness and oscillate velocity
      this.vy += (Math.random() * 0.00002 - 0.00001);
    }
    
    // Add natural deceleration/oscillation effect
    const oscillationFactor = Math.sin(timestamp * 0.0002) * 0.2; // Increased oscillation
    
    // Apply stronger oscillation to velocity (speed up and slow down more noticeably)
    this.vx *= (1 + oscillationFactor * 0.02);
    this.vy *= (1 + oscillationFactor * 0.02);
    
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