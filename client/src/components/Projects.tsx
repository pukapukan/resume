import { useEffect } from "react";
import { useCustomInView } from "@/hooks/useCustomInView";
import { useSectionStore } from "@/lib/stores/useSectionStore";
import SectionHeading from "@/components/ui/section-heading";
import { ExternalLink, Github, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
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
    image: "/textures/wood.jpg", // Using provided texture
    stack: ["Java", "Ruby", "TypeScript", "React", "GraphQL", "gRPC"],
    links: {}
  },
  {
    title: "Card Image Verification App",
    description: "Designed and integrated a vision ML-based web app, specifically a card image verification application, into the Stripe ecosystem. The application screened fraudulent attempts using fake cards, significantly enhancing security.",
    image: "/textures/asphalt.png", // Using provided texture
    stack: ["Node.js", "TensorFlow.js", "TypeScript", "React"],
    links: {}
  },
  {
    title: "Amazon Website Latency Optimization",
    description: "Spearheaded cross-functional initiatives to optimize website latency, generating $30MM+ in annual revenue gains. Implemented performant frontend solutions and backend optimizations.",
    image: "/textures/grass.png", // Using provided texture
    stack: ["JavaScript", "Java", "Performance Profiling"],
    links: {}
  },
  {
    title: "Community Platform",
    description: "Designed and deployed a local community platform for connecting residents and local businesses. Built with modern technologies and deployed on AWS infrastructure.",
    image: "/textures/sand.jpg", // Using provided texture
    stack: ["Node.js", "React.js", "GraphQL", "Redis", "AWS"],
    links: {
      github: "https://github.com",
      live: "https://example.com"
    }
  }
];

const Projects = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("projects");
    }
  }, [inView, setActiveSection]);

  // CSS animations are used instead of variants

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 px-6 min-h-screen"
    >
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeading title="Some Things I've Built" number="03" />

        <div className={`mt-16 space-y-32 ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`relative flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 animate-fadeIn`}
              style={{animationDelay: `${index * 200}ms`}}
            >
              {/* Project Image */}
              <div className="w-full md:w-7/12 h-[300px] md:h-[400px] relative rounded-md overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-background opacity-80 transition-opacity group-hover:opacity-50" />
              </div>

              {/* Project Content */}
              <div
                className={`w-full md:w-5/12 z-10 ${
                  index % 2 === 0 ? "md:ml-auto md:text-right" : "md:mr-auto"
                }`}
              >
                <p className="font-mono text-secondary mb-2">Featured Project</p>
                <h3 className="text-2xl font-bold text-text mb-4">
                  {project.title}
                </h3>
                
                <div className="bg-card p-6 rounded-md shadow-xl mb-4">
                  <p className="text-card-foreground">{project.description}</p>
                </div>
                
                <ul className={`flex flex-wrap gap-2 mb-6 ${
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                }`}>
                  {project.stack.map((tech, i) => (
                    <li
                      key={i}
                      className="font-mono text-sm text-text bg-primary/10 px-3 py-1 rounded"
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
                      className="text-text hover:text-secondary transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github size={20} />
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
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-24 text-center transition-all duration-500 ease-in-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{transitionDelay: '500ms'}}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:underline font-mono"
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
