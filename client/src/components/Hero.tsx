import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.5,
    respectClickState: true
  });
  
  const [contentVisible, setContentVisible] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setActiveSection("hero");
    }
  }, [inView, setActiveSection]);
  
  // Control the animation sequence and content visibility
  useEffect(() => {
    // Show the main paragraph and CTA after animations complete
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 1200); // Delay matches animation sequence timing
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center px-6 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        <div className="mb-6">
          <span className="font-mono text-secondary text-lg animate-fadeIn" style={{animationDelay: '100ms'}}>
            Hi, my name is
          </span>
        </div>
        
        <h1 className="hero-heading text-5xl md:text-7xl font-bold text-text mb-4">
          Jason Park.
        </h1>
        
        <div className="relative h-[80px] md:h-[100px]">
          <h2 className="hero-typewriter text-3xl md:text-5xl font-bold text-muted-foreground">
            I build exceptional digital experiences.
          </h2>
        </div>
        
        <p
          className={`max-w-2xl text-muted-foreground text-lg mt-6 mb-8 transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{transitionDelay: '100ms'}}
        >
          Senior Fullstack Software Engineer with 15 years of experience leading and 
          scaling distributed systems at Stripe, Amazon, and startups. Proven ability to 
          drive technical innovation, enhance developer experience, and build 
          high-performance systems.
        </p>
        
        <div className={`transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{transitionDelay: '200ms'}}
        >
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              console.log("Clicking explore my work button");
              
              // Update the store state
              const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
              setActiveSection("about");
              setTimeOfLastClick(Date.now());
              
              // Find the section element
              const sectionElement = document.getElementById("about");
              if (sectionElement) {
                console.log(`Found 'about' section element`);
                
                try {
                  // Direct scrollIntoView (most reliable)
                  sectionElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                  });
                  
                  // Update hash in URL after a slight delay
                  setTimeout(() => {
                    window.location.hash = "about";
                  }, 100);
                } catch (error) {
                  console.error('Error during scroll:', error);
                  // Ultimate fallback
                  window.location.hash = "about";
                }
              }
            }}
            className="group flex items-center gap-2 border-2 border-secondary text-secondary px-7 py-4 rounded font-mono hover:bg-secondary/10 transition-colors duration-300"
          >
            Explore my work
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
