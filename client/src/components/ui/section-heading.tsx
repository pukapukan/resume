import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  title: string;
  number?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * Gates Notes-style section heading with optional number
 */
const SectionHeading = ({ 
  title, 
  number,
  align = "left",
  className = ""
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "relative pb-2",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}>
      {number && (
        <div className="text-secondary font-mono text-sm mb-1 opacity-80">
          {number}.
        </div>
      )}
      
      <h2 className="text-3xl md:text-4xl font-bold text-text">
        {title}
      </h2>

      <div className={cn(
        "h-px w-16 bg-secondary mt-4",
        align === "center" && "mx-auto",
        align === "right" && "ml-auto"
      )} />
    </div>
  );
};

export default SectionHeading;