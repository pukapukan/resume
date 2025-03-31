import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  number: string;
  center?: boolean;
}

const SectionHeading = ({ title, number, center = false }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn("flex items-center w-full gap-4", center && "justify-center")}
    >
      <h2 className={cn("flex items-center text-3xl font-bold", center && "justify-center")}>
        <span className="text-secondary font-mono mr-2">
          {number}.
        </span>
        <span className="text-text">{title}</span>
      </h2>
      {!center && (
        <div className="flex-grow h-px max-w-[300px] bg-border ml-4" />
      )}
    </motion.div>
  );
};

export default SectionHeading;
