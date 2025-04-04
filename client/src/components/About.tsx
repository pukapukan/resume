import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
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

const About = () => {
  const { setActiveSection } = useSectionStore();
  const [aboutRef, setAboutRef] = useState<HTMLElement | null>(null);
  const { inView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true,
    target: aboutRef
  });

  // Animation states
  const [showContent, setShowContent] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (inView) {
      setActiveSection("about");
      if (!showContent) {
        setTimeout(() => setShowContent(true), 200);
      }
    }
  }, [inView, setActiveSection, showContent]);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  return (
    <section
      id="about"
      ref={setAboutRef as any}
      className="relative py-24 min-h-screen scroll-mt-24"
    >
      <div className="notes-container">
        <SectionHeading title="About Me" number="01" />

        <div className={`mt-16 transition-all duration-700 ease-in-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Gates Notes-style featured intro */}
          <div className="notes-card p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 space-y-6">
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
                
                <p className="text-text">
                  Currently, I'm focused on leveraging my extensive experience to create 
                  solutions that not only meet technical requirements but also exceed user 
                  expectations in terms of performance and usability.
                </p>
              </div>
              
              {/* Gates Notes-style sidebar with key highlights */}
              <div className="lg:col-span-2 space-y-6 border-l-0 lg:border-l border-primary/10 pl-0 lg:pl-10">
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">Career Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <span className="text-secondary text-2xl leading-tight">⬢</span>
                      <span className="text-text">Led engineering teams at Stripe & Amazon</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-2xl leading-tight">⬢</span>
                      <span className="text-text">Reduced fraud rates by 30%+ on major payment methods</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-2xl leading-tight">⬢</span>
                      <span className="text-text">Generated $30MM+ through website optimization</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary text-2xl leading-tight">⬢</span>
                      <span className="text-text">Created ML-powered vision-based fraud prevention</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      const { setActiveSection, setTimeOfLastClick } = useSectionStore.getState();
                      setActiveSection("projects");
                      setTimeOfLastClick(Date.now());
                      const sectionElement = document.getElementById("projects");
                      if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => { window.location.hash = "projects"; }, 100);
                      }
                    }}
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
          
          {/* Gates Notes-style skills categories */}
          <div className="mt-16 space-y-6">
            <h2 className="text-3xl font-bold text-text mb-8">Technical Proficiencies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillCategories.map((category) => (
                <div 
                  key={category.name}
                  className={`notes-card p-6 transition-all duration-300 ${
                    expandedCategory === category.name ? 'shadow-lg border-secondary/30' : ''
                  }`}
                >
                  <button 
                    onClick={() => toggleCategory(category.name)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${category.iconClass}`}>
                        {category.name.charAt(0)}
                      </span>
                      <h3 className="text-lg font-medium text-text">{category.name}</h3>
                    </div>
                    <span className={`transform transition-transform ${
                      expandedCategory === category.name ? 'rotate-180' : ''
                    }`}>▼</span>
                  </button>
                  
                  <div className={`mt-4 grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${
                    expandedCategory === category.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {category.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-text">
                        <span className="text-secondary">▹</span> 
                        {skill}
                      </div>
                    ))}
                  </div>
                  
                  {/* Preview of skills when collapsed */}
                  {expandedCategory !== category.name && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-primary/5 text-muted-foreground px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {category.skills.length > 3 && (
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
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
      </div>
    </section>
  );
};

export default About;
