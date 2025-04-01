import { useEffect } from "react";
import { useSectionStore } from "../lib/stores/useSectionStore";
import { useCustomInView } from "../hooks/useCustomInView";
import { scrollToSection } from "../lib/utils";
import { FileText, Download } from "lucide-react";
import SectionHeading from "./ui/section-heading";

const Resume = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.5,
    respectClickState: true
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("resume");
    }
  }, [inView, setActiveSection]);

  return (
    <section
      id="resume"
      ref={ref}
      className="py-20 px-6 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Resume" number="05" center />
        
        <div className="mt-12 flex flex-col items-center">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border mb-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-secondary" size={24} />
                <h3 className="text-xl font-bold">Jason Park - Resume</h3>
              </div>
              <span className="text-sm text-muted-foreground">PDF • 2 Pages</span>
            </div>
            
            <p className="text-muted-foreground mb-6">
              View or download my complete resume with detailed work history, skills, and accomplishments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/assets/Jason Park (2025).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium px-4 py-2 rounded hover:bg-secondary/90 transition-colors w-full"
              >
                <FileText size={18} />
                View Resume
              </a>
              
              <a
                href="/assets/Jason Park (2025).pdf"
                download="Jason Park (2025).pdf"
                className="flex items-center justify-center gap-2 border border-secondary text-secondary px-4 py-2 rounded hover:bg-secondary/10 transition-colors w-full font-medium"
              >
                <Download size={18} />
                Download PDF
              </a>
            </div>
          </div>
          
          <p className="text-muted-foreground text-center max-w-xl">
            Looking for a different format or more information?
            Feel free to <a 
              href="#contact" 
              className="text-secondary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                
                // Update the store state
                const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
                setActiveSection("contact");
                setTimeOfLastClick(Date.now());
                
                // Use the utility function to scroll
                scrollToSection("contact");
              }}
            >contact me</a> for additional details or custom formats.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Resume;