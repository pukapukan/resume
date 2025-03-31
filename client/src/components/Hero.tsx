import { useEffect, useState } from "react";
import { useCustomInView } from "@/hooks/useCustomInView";
import { useSectionStore } from "@/lib/stores/useSectionStore";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.5,
    respectClickState: true
  });
  
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setActiveSection("hero");
    }
  }, [inView, setActiveSection]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTypewriterComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        <div className="mb-6 animate-fadeIn">
          <span className="font-mono text-secondary text-lg">Hi, my name is</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-text mb-4 animate-fadeIn" style={{animationDelay: '200ms'}}>
          Jason Park.
        </h1>
        
        <div className="typewriter-container relative h-[80px] md:h-[100px] animate-fadeIn" style={{animationDelay: '400ms'}}>
          <h2 className="text-3xl md:text-5xl font-bold text-muted-foreground typewriter-text">
            I build exceptional digital experiences.
          </h2>
        </div>
        
        <p
          className={`max-w-2xl text-muted-foreground text-lg mt-6 mb-8 transition-opacity duration-500 ${typewriterComplete ? 'opacity-100' : 'opacity-0'}`}
        >
          Senior Fullstack Software Engineer with 15 years of experience leading and 
          scaling distributed systems at Stripe, Amazon, and startups. Proven ability to 
          drive technical innovation, enhance developer experience, and build 
          high-performance systems.
        </p>
        
        <div className={`transition-opacity duration-500 ${typewriterComplete ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              console.log("Clicking explore my work button");
              
              // Update the store state
              const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
              setActiveSection("about");
              setTimeOfLastClick(Date.now());
              
              // Find the target element
              const element = document.getElementById("about");
              
              if (!element) {
                console.error("About section not found");
                return;
              }
              
              // Get the navbar height for offset calculation
              const navbar = document.querySelector('nav');
              const navbarHeight = navbar ? navbar.offsetHeight : 80;
              
              // Calculate the element's position
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
              
              // Scroll to the element with the calculated offset
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              
              console.log("Navigation to about section complete");
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
