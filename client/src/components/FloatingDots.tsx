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
    
    // Track scroll position
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
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
            `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${0.1 + Math.random() * 0.4})` : 
            `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${0.1 + Math.random() * 0.4})`
        ));
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw dots
      dotsRef.current.forEach(dot => {
        dot.update(mouseRef.current, scrollYRef.current, canvas.width, canvas.height);
        dot.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    animate();
    
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
        `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${0.1 + Math.random() * 0.4})` : 
        `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${0.1 + Math.random() * 0.4})`;
    });
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
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
  
  constructor(x: number, y: number, size: number, color: string) {
    this.x = this.origX = x;
    this.y = this.origY = y;
    this.size = size;
    this.color = color;
    
    // Random velocity (very slow)
    this.vx = Math.random() * 0.2 - 0.1;
    this.vy = Math.random() * 0.2 - 0.1;
  }
  
  update(mouse: { x: number, y: number }, scrollY: number, width: number, height: number) {
    // Apply tiny base movement
    this.x += this.vx;
    this.y += this.vy;
    
    // Adjust for scroll - gives parallax effect
    this.y = this.origY - scrollY * 0.1;
    
    // React slightly to mouse - only if mouse is close
    const mouseDistance = Math.sqrt(
      Math.pow(mouse.x - this.x, 2) + 
      Math.pow(mouse.y - this.y, 2)
    );
    
    const mouseInfluenceRadius = 200;
    
    if (mouseDistance < mouseInfluenceRadius) {
      const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
      const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
      
      // Move away from mouse (subtle effect)
      this.x -= Math.cos(angle) * force * 0.5;
      this.y -= Math.sin(angle) * force * 0.5;
    }
    
    // Wrap around edges with a buffer
    const buffer = 50;
    
    if (this.x < -buffer) this.x = width + buffer;
    if (this.x > width + buffer) this.x = -buffer;
    if (this.y < -buffer) this.y = height + buffer;
    if (this.y > height + buffer) this.y = -buffer;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export default FloatingDots;