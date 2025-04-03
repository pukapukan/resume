import { useEffect, useState, useRef } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import ProjectArtwork from "./ProjectArtwork";

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
  const { ref, inView } = useCustomInView({
    threshold: 0.1, // Lower threshold to make content visible earlier
    respectClickState: true
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("projects");
    }
  }, [inView, setActiveSection]);

  // Use a separate state to track when to show content
  const [showContent, setShowContent] = useState(false);
  
  // Show content with a slight delay after section comes into view
  useEffect(() => {
    if (inView && !showContent) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, showContent]);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 px-6 min-h-screen scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeading title="Some Things I've Built" number="03" />

        <div className={`mt-16 space-y-32 ${showContent ? 'animate-fadeIn' : 'opacity-0'}`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`relative flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 animate-fadeIn`}
              style={{animationDelay: `${Math.min(index * 150, 500)}ms`}} 
            >
              {/* Project Artwork with Retro Pixel Art effect */}
              <div className="w-full md:w-5/12 h-[250px] md:h-[300px] pixel-art-container group">
                <ProjectArtwork 
                  type={project.artworkType}
                  inView={showContent}
                  className="w-full h-full z-10"
                />
                
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Project Content */}
              <div
                className={`w-full md:w-7/12 z-10 ${
                  index % 2 === 0 ? "md:ml-auto md:text-right" : "md:mr-auto"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 font-mono text-secondary text-sm">
                  <span>{index % 2 === 0 ? "" : "Featured Project @"}</span>
                  <span className="bg-secondary/10 px-3 py-1 rounded-full text-secondary">
                    {project.company}
                  </span>
                  <span>{index % 2 === 1 ? "" : "Featured Project"}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-text mb-4 tracking-tight">
                  {project.title}
                </h3>
                
                <div className="bg-card p-6 rounded-lg shadow-xl mb-6 border border-primary/10 backdrop-blur-sm">
                  <p className="text-card-foreground leading-relaxed">{project.description}</p>
                </div>
                
                <ul className={`flex flex-wrap gap-2 mb-6 ${
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                }`}>
                  {project.stack.map((tech, i) => (
                    <li
                      key={i}
                      className="font-mono text-sm text-text bg-secondary/10 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                
                <div className={`flex gap-4 ${
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                }`}>
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-secondary transition-colors p-2 bg-card rounded-full hover:bg-card/80"
                      aria-label="GitHub Repository"
                    >
                      <Github size={22} />
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-secondary transition-colors p-2 bg-card rounded-full hover:bg-card/80"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={22} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-24 text-center transition-all duration-500 ease-in-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{transitionDelay: '300ms'}}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:bg-secondary/10 font-mono py-2 px-4 rounded-full transition-colors"
          >
            View more projects on GitHub
            <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
