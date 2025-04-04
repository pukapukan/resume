import { useEffect, useState, useRef } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { ExternalLink, Github, ChevronRight, BookOpen } from "lucide-react";
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
    links: {
      github: "https://github.com",
      live: "https://example.com"
    }
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

        {/* Gates Notes-inspired featured project layout */}
        <div className={`mt-16 ${showContent ? 'animate-fadeIn' : 'opacity-0'}`}>
          {/* Highlight first project as featured */}
          <div className="notes-card mb-24 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="h-[300px] md:h-[400px] lg:h-full relative pixel-art-container lg:rounded-none">
                <ProjectArtwork 
                  type={projects[0].artworkType}
                  inView={showContent}
                  className="w-full h-full z-10"
                />
              </div>
              
              <div className="p-8 md:p-12 space-y-6 bg-card/70 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-mono text-secondary text-sm mb-4">
                  <span className="bg-secondary/10 px-3 py-1 rounded-full text-secondary">
                    {projects[0].company}
                  </span>
                  <span>Featured Project</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
                  {projects[0].title}
                </h2>
                
                <p className="text-muted-foreground notes-drop-cap">
                  {projects[0].description}
                </p>
                
                <ul className="flex flex-wrap gap-2 my-6">
                  {projects[0].stack.map((tech, i) => (
                    <li
                      key={i}
                      className="font-mono text-sm text-text bg-secondary/10 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors group"
                  >
                    Learn more about this project
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gates Notes-style quote between content sections */}
          <PullQuote 
            quote="The most pressing challenges in technology require creative thinking and innovative approaches. These projects represent my commitment to developing solutions that drive real business impact."
            align="center"
          />
          
          <SectionDivider variant="gradient" />
          
          {/* Remaining projects in Gates Notes grid style */}
          <div className="notes-article-list mt-16 mb-24">
            {projects.slice(1).map((project, index) => (
              <div key={index} className="notes-card flex flex-col h-full">
                <div className="h-[240px] pixel-art-container rounded-t-lg rounded-b-none relative">
                  <ProjectArtwork 
                    type={project.artworkType}
                    inView={showContent}
                    className="w-full h-full z-10"
                  />
                  
                  <div className="absolute top-4 left-4 z-20 bg-secondary/10 px-3 py-1 rounded-full">
                    <span className="font-mono text-xs text-secondary">{project.company}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-text mb-3">{project.title}</h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {project.description.length > 180 
                      ? `${project.description.substring(0, 180)}...` 
                      : project.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 mt-auto">
                    <ul className="flex flex-wrap gap-1">
                      {project.stack.slice(0, 3).map((tech, i) => (
                        <li
                          key={i}
                          className="font-mono text-xs text-secondary"
                        >
                          {tech}{i < Math.min(project.stack.length, 3) - 1 ? ' • ' : ''}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex gap-2">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-secondary transition-colors"
                          aria-label="GitHub Repository"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-secondary transition-colors"
                          aria-label="Live Demo"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <a
                        href="#"
                        className="text-text hover:text-secondary transition-colors"
                        aria-label="Read More"
                      >
                        <BookOpen size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gates Notes-style call to action */}
        <CallToAction 
          title="Interested in more of my work?"
          description="Check out my GitHub profile for additional projects and contributions to open source."
          primaryButtonText="View GitHub Profile"
          primaryButtonLink="https://github.com"
          variant="highlight"
        />
      </div>
    </section>
  );
};

export default Projects;
