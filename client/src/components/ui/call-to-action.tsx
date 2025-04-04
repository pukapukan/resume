import { useEffect, useState } from 'react';
import { useCustomInView } from '../../hooks/useCustomInView';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  title: string;
  description?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'highlight' | 'subtle';
  align?: 'left' | 'center';
}

/**
 * Gates Notes-style call to action component
 * Creates compelling action prompts for users
 */
const CallToAction = ({ 
  title, 
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  variant = 'default',
  align = 'center'
}: CallToActionProps) => {
  const [ctaRef, setCtaRef] = useState<HTMLElement | null>(null);
  const { inView } = useCustomInView({
    threshold: 0.2,
    target: ctaRef
  });

  // State for visibility
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, isVisible]);

  // Determine background styles based on variant
  const getBgStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-secondary/10 text-text';
      case 'subtle':
        return 'bg-primary/5 text-text';
      default:
        return 'bg-primary/10 text-text';
    }
  };

  // Determine button styles based on variant
  const getPrimaryButtonStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-secondary text-background hover:bg-secondary/90';
      case 'subtle':
        return 'bg-text text-background hover:bg-text/90';
      default:
        return 'bg-primary text-text hover:bg-primary/90';
    }
  };

  const getSecondaryButtonStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'border border-secondary text-secondary hover:bg-secondary/10';
      case 'subtle':
        return 'border border-text text-text hover:bg-text/10';
      default:
        return 'border border-primary text-primary hover:bg-primary/10';
    }
  };

  return (
    <section 
      ref={setCtaRef as any}
      className={`
        my-24 py-16 px-8 rounded-lg ${getBgStyles()}
        ${align === 'center' ? 'text-center' : 'text-left'}
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        
        {description && (
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        <div className={`flex gap-4 flex-wrap mt-8 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
          <a 
            href={primaryButtonLink}
            className={`
              px-6 py-3 rounded-md font-medium flex items-center gap-2
              transition-all duration-300 ${getPrimaryButtonStyles()}
            `}
          >
            {primaryButtonText}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          
          {secondaryButtonText && secondaryButtonLink && (
            <a 
              href={secondaryButtonLink}
              className={`
                px-6 py-3 rounded-md font-medium
                transition-all duration-300 ${getSecondaryButtonStyles()}
              `}
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;