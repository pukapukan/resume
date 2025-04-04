import { useEffect, useState } from "react";
import { useCustomInView } from "../../hooks/useCustomInView";
import { cn } from "../../lib/utils";

interface PullQuoteProps {
  quote: string;
  author?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Gates Notes-style pull quote component
 * Creates an elegantly styled quote that stands out in the page content
 */
const PullQuote = ({ 
  quote, 
  author, 
  align = 'left',
  className = ''
}: PullQuoteProps) => {
  const [quoteRef, setQuoteRef] = useState<HTMLElement | null>(null);
  const { inView } = useCustomInView({
    threshold: 0.1,
    target: quoteRef
  });

  // State to handle animation
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, isVisible]);

  return (
    <blockquote 
      ref={setQuoteRef as any}
      className={cn(
        "my-16 mx-auto max-w-4xl text-xl md:text-2xl px-8 relative",
        align === 'center' && "text-center",
        align === 'right' && "text-right",
        className
      )}
    >
      <div className={cn(
        "transition-all duration-700 ease-out", 
        isVisible 
          ? "opacity-100 transform translate-y-0" 
          : "opacity-0 transform translate-y-4"
      )}>
        {/* Quote marks */}
        <span 
          className="absolute text-6xl md:text-8xl font-serif text-secondary opacity-20 -top-8 -left-2 md:-left-6 select-none"
          aria-hidden="true"
        >
          "
        </span>
        
        <p className="relative z-10 font-medium leading-relaxed text-text">
          {quote}
        </p>
        
        {author && (
          <footer className="mt-4 text-base text-muted-foreground">
            — <cite className="font-medium not-italic">{author}</cite>
          </footer>
        )}
        
        <span 
          className="absolute text-6xl md:text-8xl font-serif text-secondary opacity-20 bottom-0 md:bottom-4 right-2 md:right-6 select-none"
          aria-hidden="true"
        >
          "
        </span>
      </div>
    </blockquote>
  );
};

export default PullQuote;