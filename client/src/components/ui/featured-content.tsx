import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { scrollToSection } from "../../lib/utils";

interface FeaturedContentProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundOpacity?: number;
  ctaText?: string;
  ctaLink?: string;
  ctaOnClick?: () => void;
  imageSide?: "left" | "right";
  children?: React.ReactNode;
}

/**
 * FeaturedContent - A component inspired by Gates Notes featured articles
 * Displays content in a two-column layout with optional background elements
 */
const FeaturedContent = ({
  title,
  subtitle,
  description,
  backgroundOpacity = 0.1,
  ctaText = "Learn more",
  ctaLink = "#",
  ctaOnClick,
  imageSide = "right",
  children
}: FeaturedContentProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Animate in after a small delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle CTA click with smooth scroll
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (ctaOnClick) {
      ctaOnClick();
    } else if (ctaLink.startsWith('#')) {
      const sectionId = ctaLink.substring(1);
      scrollToSection(sectionId);
    } else {
      window.location.href = ctaLink;
    }
  };
  
  return (
    <div className={`relative overflow-hidden rounded-lg transition-all duration-700 ease-in-out ${
      visible ? 'opacity-100' : 'opacity-0 translate-y-8'
    }`}>
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5"
        style={{ opacity: backgroundOpacity }}
      />
      
      {/* Content grid */}
      <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
        imageSide === "left" ? "md:flex-row-reverse" : ""
      }`}>
        {/* Text content */}
        <div className={`p-6 md:p-10 space-y-6 ${
          imageSide === "right" ? "order-1" : "order-2 md:order-1"
        }`}>
          <div className="space-y-4">
            <div className="inline-block font-mono text-sm text-secondary border border-secondary/30 px-3 py-1 rounded">
              {subtitle}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text tracking-tight leading-tight">
              {title}
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="pt-4">
            <a
              href={ctaLink}
              onClick={handleCtaClick}
              className="group flex items-center gap-2 text-secondary hover:text-secondary-dark transition-colors"
            >
              {ctaText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Media content */}
        <div className={`${
          imageSide === "right" ? "order-2" : "order-1 md:order-2"
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;