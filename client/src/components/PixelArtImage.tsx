import { useState, useEffect, useRef } from 'react';

interface PixelArtImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * PixelArtImage component that transitions from pixelated to clear
 * as the element enters the viewport
 */
const PixelArtImage = ({ src, alt, className = '' }: PixelArtImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const [pixelationLevel, setPixelationLevel] = useState(20); // Start very pixelated (lower = more pixelated)
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -10% 0px' // Slightly before the element enters the viewport
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  // Gradually increase resolution when in view
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setPixelationLevel((prev) => {
          // Stop increasing resolution once we reach full clarity
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5; // Increase by 5 each step
        });
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    } else {
      // Reset to pixelated when out of view
      setPixelationLevel(20);
    }
  }, [isInView]);

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div 
        className="w-full h-full transition-transform duration-200 relative"
        style={{ 
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `blur(${isInView ? 0 : 1}px)`,
          imageRendering: pixelationLevel < 100 ? 'pixelated' : 'auto',
          transform: `scale(${pixelationLevel / 100})`,
        }}
      >
        {/* Invisible image to maintain aspect ratio */}
        <img 
          src={src} 
          alt={alt} 
          className="invisible w-full h-full" 
        />
      </div>
    </div>
  );
};

export default PixelArtImage;