import { cn } from "../../lib/utils";

interface SectionDividerProps {
  variant?: 'simple' | 'gradient' | 'dots';
  className?: string;
}

/**
 * Gates Notes-style section divider component
 * Creates elegant visual separators between content sections
 */
const SectionDivider = ({ 
  variant = 'simple',
  className = ''
}: SectionDividerProps) => {
  return (
    <div className={cn(
      "my-12 flex justify-center items-center px-4",
      className
    )}>
      {variant === 'simple' && (
        <div className="w-32 h-px bg-primary/20" />
      )}

      {variant === 'gradient' && (
        <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary/40" />
          <div className="w-3 h-3 rounded-full bg-secondary/60" />
          <div className="w-2 h-2 rounded-full bg-secondary/40" />
        </div>
      )}
    </div>
  );
};

export default SectionDivider;