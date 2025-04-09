import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/stores/useThemeStore';
import { useParallax } from '../hooks/useParallax';

/**
 * FloatingDots - Creates subtle floating dot particles
 * that react to scroll position and move gently across the screen
 * with parallax effects at different depths
 */
const FloatingDots: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore(state => state.theme);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);
  
  // Use extremely subtle parallax speeds for different layers of dots
  const parallaxForeground = useParallax(0.03, 'vertical', 60); // Foreground dots (move slightly faster)
  const parallaxMiddle = useParallax(0.02, 'vertical', 70); // Middle layer (very subtle)
  const parallaxBackground = useParallax(0.01, 'vertical', 80); // Background dots (barely move)
  
  // Dot layer assignments - keep track of which dot belongs to which layer
  const [dotLayers, setDotLayers] = useState<{[id: number]: 'foreground' | 'middle' | 'background'}>({});
  
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
      const layers: {[id: number]: 'foreground' | 'middle' | 'background'} = {};
      
      // Define dot layers - approximately 20% foreground, 30% middle, 50% background
      // for a sense of depth
      
      for (let i = 0; i < dotCount; i++) {
        // Randomly assign layer with weighted distribution
        let layer: 'foreground' | 'middle' | 'background';
        const rand = Math.random();
        
        if (rand < 0.2) {
          layer = 'foreground';
        } else if (rand < 0.5) {
          layer = 'middle';
        } else {
          layer = 'background';
        }
        
        // Create dot with appropriate size based on layer (foreground = larger)
        const size = layer === 'foreground' 
                      ? Math.random() * 2 + 1.5 
                      : layer === 'middle'
                        ? Math.random() * 1.5 + 1
                        : Math.random() * 1 + 0.8;
        
        // Create dot with layer-appropriate opacity
        const opacity = layer === 'foreground' 
                          ? 0.2 + Math.random() * 0.4
                          : layer === 'middle'
                            ? 0.15 + Math.random() * 0.35
                            : 0.1 + Math.random() * 0.3;
        
        const newDot = new Dot(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          size,
          theme === 'dark' 
            ? `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${opacity})` 
            : `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${opacity})`,
          i // unique ID
        );
        
        dotsRef.current.push(newDot);
        layers[i] = layer;
      }
      
      // Store layer assignments
      setDotLayers(layers);
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw dots with parallax effect
      dotsRef.current.forEach(dot => {
        // Get parallax offset based on dot's layer
        let parallaxOffset = 0;
        const layer = dotLayers[dot.id] || 'middle';
        
        switch(layer) {
          case 'foreground':
            parallaxOffset = parallaxForeground;
            break;
          case 'middle':
            parallaxOffset = parallaxMiddle;
            break;
          case 'background':
            parallaxOffset = parallaxBackground;
            break;
        }
        
        dot.update(
          mouseRef.current, 
          scrollYRef.current, 
          canvas.width, 
          canvas.height, 
          parallaxOffset,
          layer
        );
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
  }, [theme, parallaxForeground, parallaxMiddle, parallaxBackground]);
  
  // When theme changes, update dot colors
  useEffect(() => {
    if (!canvasRef.current) return;
    
    dotsRef.current.forEach(dot => {
      const layer = dotLayers[dot.id] || 'middle';
      const opacity = layer === 'foreground' 
                        ? 0.2 + Math.random() * 0.4
                        : layer === 'middle'
                          ? 0.15 + Math.random() * 0.35
                          : 0.1 + Math.random() * 0.3;
      
      dot.color = theme === 'dark' 
        ? `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${opacity})` 
        : `rgba(${10 + Math.random() * 40}, ${50 + Math.random() * 100}, ${100 + Math.random() * 175}, ${opacity})`;
    });
  }, [theme, dotLayers]);
  
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
  id: number; // Unique ID for layer assignment
  
  constructor(x: number, y: number, size: number, color: string, id: number) {
    this.x = this.origX = x;
    this.y = this.origY = y;
    this.size = size;
    this.color = color;
    this.id = id;
    
    // Random velocity (extremely slow)
    this.vx = Math.random() * 0.05 - 0.025; // 4x slower
    this.vy = Math.random() * 0.05 - 0.025; // 4x slower
  }
  
  update(
    mouse: { x: number, y: number }, 
    scrollY: number, 
    width: number, 
    height: number, 
    parallaxOffset: number = 0,
    layer: 'foreground' | 'middle' | 'background' = 'middle'
  ) {
    // Apply tiny base movement
    this.x += this.vx;
    
    // Apply extremely subtle parallax effect based on layer
    // Using a tiny fraction of the calculated parallax offset
    // and applying a damping factor to make movement minimal
    const dampingFactor = 0.2; // Reduce effect by 80%
    this.y = this.origY - (parallaxOffset * dampingFactor);
    
    // Adjust base y position with base movement
    this.origY += this.vy;
    
    // React slightly to mouse - only if mouse is close and dot is in foreground/middle layer
    if (layer !== 'background') {
      const mouseDistance = Math.sqrt(
        Math.pow(mouse.x - this.x, 2) + 
        Math.pow(mouse.y - this.y, 2)
      );
      
      // Different influence radius based on layer
      const mouseInfluenceRadius = layer === 'foreground' ? 250 : 200;
      
      if (mouseDistance < mouseInfluenceRadius) {
        const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
        
        // Move away from mouse (strength based on layer)
        const repelStrength = layer === 'foreground' ? 0.3 : 0.2;
        this.x -= Math.cos(angle) * force * repelStrength;
        this.y -= Math.sin(angle) * force * repelStrength;
      }
    }
    
    // Wrap around edges with a buffer
    const buffer = 50;
    
    if (this.x < -buffer) this.x = width + buffer;
    if (this.x > width + buffer) this.x = -buffer;
    
    // For y position, we need to wrap the original position
    if (this.origY < -buffer) this.origY = height + buffer;
    if (this.origY > height + buffer) this.origY = -buffer;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export default FloatingDots;