import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import { ArrowRight } from "lucide-react";
import PullQuote from "./ui/pull-quote";

// Skills categories organized like Gates Notes topics
const skillCategories = [
  {
    name: "Languages & Frameworks",
    skills: [
      "TypeScript/JavaScript",
      "React.js",
      "Node.js",
      "Java",
      "Ruby",
      "Python", 
      "Kotlin",
      "HTML5/CSS3"
    ],
    iconClass: "bg-blue-500/10 text-blue-400"
  },
  {
    name: "APIs & Communication",
    skills: [
      "GraphQL",
      "gRPC",
      "REST"
    ],
    iconClass: "bg-purple-500/10 text-purple-400"
  },
  {
    name: "Cloud & DevOps",
    skills: [
      "AWS",
      "Docker",
      "Terraform"
    ],
    iconClass: "bg-orange-500/10 text-orange-400"
  },
  {
    name: "Databases & Caching",
    skills: [
      "PostgreSQL",
      "Redis",
      "DynamoDB",
      "Pinot",
      "ElasticSearch",
      "Kafka"
    ],
    iconClass: "bg-green-500/10 text-green-400"
  }
];

const HeroAbout = () => {
  const { setActiveSection } = useSectionStore();
  const [heroRef, setHeroRef] = useState<HTMLElement | null>(null);
  const { inView: heroInView } = useCustomInView({
    threshold: 0.5,
    respectClickState: true,
    target: heroRef
  });
  
  const [aboutRef, setAboutRef] = useState<HTMLElement | null>(null);
  const { inView: aboutInView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true,
    target: aboutRef
  });

  const [contentVisible, setContentVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Set active section based on which part is in view
  useEffect(() => {
    if (heroInView) {
      setActiveSection("hero");
    } else if (aboutInView) {
      setActiveSection("about");
    }
  }, [heroInView, aboutInView, setActiveSection]);
  
  // Control the animation sequence and content visibility
  useEffect(() => {
    // Show the main paragraph and CTA after animations complete
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 1000); // Shorter delay for better UX
    
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  // Handle scroll to about section
  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Scrolling to about section");
    
    // Update the store state
    const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
    setActiveSection("about");
    setTimeOfLastClick(Date.now());
    
    // Find the section element
    const sectionElement = aboutRef;
    if (sectionElement) {
      console.log('Found about section element');
      
      try {
        // Direct scrollIntoView
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
        window.location.hash = "about";
      }
    }
  };

  // Handle scroll to projects section  
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
    setActiveSection("projects");
    setTimeOfLastClick(Date.now());
    
    const sectionElement = document.getElementById("projects");
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { window.location.hash = "projects"; }, 100);
    }
  };

  return (
    <>
      {/* Hero Section - Full Height */}
      <section
        id="hero"
        ref={(el) => setHeroRef(el)}
        className="relative w-full min-h-screen flex items-center px-6 pt-16 pb-12 md:pt-0 md:pb-0 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          <div className="mb-6">
            <span className="font-mono text-secondary text-lg animate-fadeIn" style={{animationDelay: '100ms'}}>
              Hi, my name is
            </span>
          </div>
          
          <h1 id="hero-name" className="hero-heading text-4xl sm:text-5xl md:text-7xl font-bold text-text mb-3 md:mb-4">
            <span className="text-secondary">J</span>ason <span className="text-secondary">P</span>ark.
          </h1>
          
          <div className="relative h-[60px] sm:h-[70px] md:h-[100px]">
            <h2 className="hero-typewriter text-2xl sm:text-3xl md:text-5xl font-bold text-muted-foreground">
              I build exceptional digital experiences.
            </h2>
          </div>
          
          <p
            className={`max-w-xl text-muted-foreground text-base sm:text-lg mt-4 sm:mt-6 mb-6 sm:mb-8 transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            Senior Fullstack Engineer with 15 years of experience at Stripe, Amazon, and startups. 
            Building high-performance systems that deliver exceptional results.
          </p>
          
          <div className={`transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
            <a
              href="#about"
              onClick={scrollToAbout}
              className="group flex items-center gap-2 border-2 border-secondary text-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded font-mono hover:bg-secondary/10 transition-colors duration-300"
            >
              Learn more
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section - More Compact */}
      <section
        id="about"
        ref={(el) => setAboutRef(el)}
        className="relative py-20 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Gates Notes-style featured intro */}
          <div className="notes-card p-6 md:p-10 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-5">
                <p className="notes-drop-cap text-lg">
                  Hello! I'm Jason, a seasoned Fullstack Software Engineer with a passion 
                  for creating exceptional digital experiences that blend powerful functionality 
                  with intuitive design.
                </p>
                
                <p className="text-text">
                  With over 15 years in the tech industry, I've had the privilege of leading 
                  and scaling distributed systems at renowned companies like 
                  <span className="text-secondary font-medium"> Stripe</span> and
                  <span className="text-secondary font-medium"> Amazon</span>, as well as innovative startups.
                </p>
                
                <p className="text-text">
                  My journey in software engineering has been marked by a consistent drive to 
                  enhance developer experiences and build high-performance systems that improve 
                  reliability, security, and business impact at scale.
                </p>
              </div>
              
              {/* Gates Notes-style sidebar with key highlights */}
              <div className="lg:col-span-2 space-y-5 border-l-0 lg:border-l border-primary/10 pl-0 lg:pl-8">
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">Career Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <span className="text-secondary text-xl leading-tight">⬢</span>
                      <span className="text-text">Led engineering teams at Stripe & Amazon</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-xl leading-tight">⬢</span>
                      <span className="text-text">Reduced fraud rates by 30%+ on major payment methods</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-xl leading-tight">⬢</span>
                      <span className="text-text">Generated $30MM+ through website optimization</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-xl leading-tight">⬢</span>
                      <span className="text-text">Created ML-powered vision-based fraud prevention</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <a
                    href="#projects"
                    onClick={scrollToProjects}
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors group"
                  >
                    See my project work
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gates Notes-style pull quote */}
          <PullQuote 
            quote="I believe that great software is not just about code, but about solving real problems for real people in elegant, maintainable ways."
            align="center"
          />
          
          {/* Gates Notes-style skills categories - More compact */}
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-text mb-6">Technical Proficiencies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillCategories.map((category) => (
                <div 
                  key={category.name}
                  className={`notes-card p-5 transition-all duration-300 ${
                    expandedCategory === category.name ? 'shadow-lg border-secondary/30' : ''
                  }`}
                >
                  <button 
                    onClick={() => toggleCategory(category.name)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center ${category.iconClass}`}>
                        {category.name.charAt(0)}
                      </span>
                      <h3 className="text-base font-medium text-text">{category.name}</h3>
                    </div>
                    <span className={`transform transition-transform text-xs ${
                      expandedCategory === category.name ? 'rotate-180' : ''
                    }`}>▼</span>
                  </button>
                  
                  <div className={`mt-3 grid grid-cols-2 gap-1 overflow-hidden transition-all duration-300 ${
                    expandedCategory === category.name ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {category.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-sm text-text">
                        <span className="text-secondary">▹</span> 
                        {skill}
                      </div>
                    ))}
                  </div>
                  
                  {/* Preview of skills when collapsed */}
                  {expandedCategory !== category.name && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {category.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-primary/5 text-muted-foreground px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {category.skills.length > 3 && (
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                          +{category.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroAbout;