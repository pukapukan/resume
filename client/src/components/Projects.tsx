import { useEffect, useState, useRef } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { ExternalLink, ChevronRight, BookOpen } from "lucide-react";
import { ArrowRight } from "lucide-react";
import ProjectArtwork from "./ProjectArtwork";
import PullQuote from "./ui/pull-quote";
import SectionDivider from "./ui/section-divider";
import CallToAction from "./ui/call-to-action";

interface Project {
  title: string;
  description: string;
  artworkType: 'fraud-system' | 'card-verification' | 'website-optimization' | 'community-platform';
  company: string;
  stack: string[];
  links: {
    github?: string;
    live?: string;
  };
}

const projects: Project[] = [
  {
    title: "Stripe Fraud Protection System",
    description: "Led the scaling of Stripe's fraud protection system, expanding supported payment methods by 50x. The initiative culminated in a successful alpha/beta launch screening $10MM+ in transactions per day and reducing fraud rates by 30%+ on major payment methods.",
    artworkType: "fraud-system",
    company: "Stripe",
    stack: ["Java", "Ruby", "TypeScript", "React", "GraphQL", "gRPC"],
    links: {}
  },
  {
    title: "Card Image Verification App",
    description: "Designed and integrated a vision ML-based web app, specifically a card image verification application, into the Stripe ecosystem. The application screened fraudulent attempts using fake cards, significantly enhancing security.",
    artworkType: "card-verification",
    company: "Stripe",
    stack: ["Node.js", "TensorFlow.js", "TypeScript", "React"],
    links: {}
  },
  {
    title: "Amazon Website Latency Optimization",
    description: "Spearheaded cross-functional initiatives to optimize website latency, generating $30MM+ in annual revenue gains. Implemented performant frontend solutions and backend optimizations.",
    artworkType: "website-optimization",
    company: "Amazon",
    stack: ["JavaScript", "Java", "Performance Profiling"],
    links: {}
  },
  {
    title: "Community Platform",
    description: "Designed and deployed a local community platform for connecting residents and local businesses. Built with modern technologies and deployed on AWS infrastructure.",
    artworkType: "community-platform",
    company: "Personal Project",
    stack: ["Node.js", "React", "GraphQL", "Redis", "AWS"],
    links: {}
  }
];

const Projects = () => {
  const { setActiveSection } = useSectionStore();
  const [projectsRef, setProjectsRef] = useState<HTMLElement | null>(null);
  const { inView } = useCustomInView({
    threshold: 0.1, // Lower threshold to make content visible earlier
    respectClickState: true,
    target: projectsRef
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("projects");
    }
  }, [inView, setActiveSection]);

  // Use a separate state to track when to show content with a ref to avoid re-renders
  const [showContent, setShowContent] = useState(false);
  const contentShown = useRef(false);
  
  // Show content immediately when section comes into view, but only once
  useEffect(() => {
    if (inView && !contentShown.current) {
      contentShown.current = true;
      setShowContent(true);
    }
  }, [inView]);

  return (
    <section
      id="projects"
      ref={setProjectsRef as any}
      className="relative pt-24 scroll-mt-24"
    >
      <div className="notes-container">
        <SectionHeading title="Some Things I've Built" number="03" />

        {/* Streamlined project layout */}
        <div className={`mt-10 ${showContent ? 'animate-fadeIn' : 'opacity-0'}`}>
          {/* Ultra-compact featured project */}
          <div className="notes-card mb-12 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 lg:w-1/5 h-[140px] md:h-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ProjectArtwork 
                  type={projects[0].artworkType}
                  inView={showContent}
                  className="w-full h-full z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="p-4 md:p-5 flex-1 space-y-3 bg-card/70 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-secondary/10 px-2 py-0.5 rounded-full text-xs font-mono text-secondary group-hover:bg-secondary/20 transition-colors duration-300">
                      {projects[0].company}
                    </span>
                    <span className="text-xs text-secondary/80 font-medium group-hover:text-secondary transition-colors duration-300">Featured Project</span>
                  </div>
                </div>
                
                <h2 className="text-lg md:text-xl font-bold text-text tracking-tight group-hover:text-secondary/90 transition-colors duration-300">
                  {projects[0].title}
                </h2>
                
                <p className="text-muted-foreground text-xs md:text-sm group-hover:text-text/90 transition-colors duration-300">
                  {projects[0].description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {projects[0].stack.map((tech, i) => (
                    <li
                      key={i}
                      className="font-mono text-[10px] md:text-xs text-text bg-secondary/10 px-1.5 py-0.5 rounded-full list-none transform transition-all duration-300 hover:scale-110 hover:bg-secondary/20"
                    >
                      {tech}
                    </li>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-3">
                  {projects[0].links.live && (
                    <a
                      href={projects[0].links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-secondary transition-all duration-300 flex items-center gap-1 text-xs hover:translate-x-0.5"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={12} className="transition-transform duration-300 group-hover:rotate-12" /> Live demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Simplified quote between content sections */}
          <div className="mt-8 mb-8 text-center px-4 md:px-12 lg:px-24">
            <p className="text-muted-foreground text-sm italic">
              "These projects represent my approach to solving complex challenges and delivering impactful solutions."
            </p>
          </div>
          
          <SectionDivider variant="gradient" className="mt-2 mb-6" />
          
          {/* Highly compact project cards in responsive grid */}
          <div className="mt-12 mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(1).map((project, index) => (
              <div 
                key={index} 
                className={`notes-card flex flex-col h-full overflow-hidden shadow-sm hover:shadow-lg 
                          transition-all duration-300 hover:-translate-y-1 group 
                          ${index % 3 === 0 ? 'hover:border-l-2 hover:border-l-secondary/50' : 
                            index % 3 === 1 ? 'hover:border-b-2 hover:border-b-secondary/50' : 
                            'hover:border-r-2 hover:border-r-secondary/50'}`}
              >
                <div className="flex items-stretch h-full">
                  {/* Image on the left */}
                  <div className="w-24 min-w-[5rem] relative overflow-hidden">
                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ProjectArtwork 
                      type={project.artworkType}
                      inView={showContent}
                      className="w-full h-full z-10 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content on the right */}
                  <div className="flex-1 p-3 md:p-4 flex flex-col relative">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-0 
                                   group-hover:opacity-100 group-hover:animate-gradient-x pointer-events-none transition-opacity duration-300`}></div>
                    <div className="mb-1.5 flex items-center justify-between relative z-10">
                      <span className="inline-block bg-secondary/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-secondary 
                                     group-hover:bg-secondary/20 transition-colors duration-300">
                        {project.company}
                      </span>
                      
                      <div className="flex gap-1.5">
                        {project.links.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text hover:text-secondary transition-all duration-300 
                                     hover:scale-110 hover:rotate-3"
                            aria-label="Live Demo"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-bold text-text leading-tight mb-1.5 transition-colors duration-300 
                                 group-hover:text-secondary/90 relative z-10">{project.title}</h3>
                    
                    <p className="text-muted-foreground text-xs mb-2 flex-grow transition-colors duration-300 
                               group-hover:text-text/80 relative z-10">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto relative z-10">
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {project.stack.map((tech, i) => (
                          <span
                            key={i}
                            className="font-mono text-[10px] text-secondary transition-all duration-300 
                                     group-hover:tracking-wide"
                          >
                            {tech}{i < project.stack.length - 1 ? 
                              <span className="group-hover:animate-pulse"> • </span> : 
                              ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Removed the call to action as requested */}
      </div>
    </section>
  );
};

export default Projects;
