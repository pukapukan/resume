import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { ChevronRight, Briefcase, Calendar, MapPin } from "lucide-react";
import PullQuote from "./ui/pull-quote";

interface ExperienceItem {
  company: string;
  location: string;
  position: string;
  duration: string;
  description: string[];
  techs?: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Stripe",
    location: "Remote (Irvine, CA)",
    position: "Senior Fullstack Software Engineer",
    duration: "Jun 2022 - Present",
    description: [
      "Tech Lead for a project that scaled Stripe's fraud protection system, expanding supported payment methods by 50x.",
      "Led from ideation to technical design and development, launching alpha/beta screening $10MM+ in transactions daily with 30%+ fraud rate reduction.",
      "Designed and integrated a vision ML-based web app for card image verification, screening fraudulent attempts using fake cards.",
      "Conducted a full UX/UI overhaul and ran A/B tests that increased engagement by 20%.",
      "Awarded org-level recognition for rewriting frontend developer experience setups, reducing dev ramp up from days to minutes."
    ],
    techs: "Java, Ruby, TypeScript, React, GraphQL, gRPC, Node.js, TensorFlow.js"
  },
  {
    company: "Amazon",
    location: "Seattle/London",
    position: "Senior Software Engineer",
    duration: "Nov 2016 - Jun 2022",
    description: [
      "Spearheaded cross-functional initiatives to optimize website latency, generating $30MM+ in annual revenue gains.",
      "Reduced API service traffic by 60% and cut hardware costs by $3M+ annually through strategic caching optimizations.",
      "Led a team of 5 engineers in enhancing the retail website experience for non-Prime customers.",
      "Oversaw architecture, technical designs, and backend service deployment, significantly improving engagement."
    ],
    techs: "Java, JavaScript, AWS, React, Memcached"
  },
  {
    company: "Freelance",
    location: "Seoul, South Korea",
    position: "Full Stack Developer",
    duration: "Mar 2015 - Oct 2016",
    description: [
      "Developed two API services and two content management systems for mobile apps used by multinational clients.",
      "Built three educational JavaScript-based online games for UK local councils.",
      "Designed and deployed a local community platform using modern web technologies."
    ],
    techs: "Node.js, React.js, GraphQL, Redis, AWS"
  },
  {
    company: "LateRooms.com",
    location: "Singapore",
    position: "Full Stack Developer",
    duration: "Aug 2014 - Feb 2015",
    description: [
      "Modernized the account management service on a Node.js stack, improving user acquisition rates.",
      "Enhanced system architecture to support multiple brands, increasing code reusability."
    ],
    techs: "Node.js, JavaScript, HTML/CSS"
  },
  {
    company: "Avanade",
    location: "Singapore",
    position: "IT Consultant",
    duration: "May 2012 - Aug 2014",
    description: [
      "Led a team of 10 engineers in delivering a 1000+ manday project for the Inland Revenue Authority of Singapore (IRAS).",
      "Designed an online corporate income tax filing system on the .NET stack."
    ],
    techs: ".NET, C#, SQL Server"
  }
];

const Experience = () => {
  const { setActiveSection } = useSectionStore();
  const [expRef, setExpRef] = useState<HTMLElement | null>(null);
  const { inView } = useCustomInView({
    threshold: 0.2,
    respectClickState: true,
    target: expRef
  });

  // Animation states
  const [activeCompany, setActiveCompany] = useState("Stripe");

  useEffect(() => {
    if (inView) {
      setActiveSection("experience");
    }
  }, [inView, setActiveSection]);

  return (
    <section
      id="experience"
      ref={setExpRef as any}
      className="relative py-24 min-h-screen scroll-mt-24"
    >
      <div className="notes-container">
        <SectionHeading title="Where I've Worked" number="02" />

        <div className="mt-16">
          {/* Gates Notes-style quote */}
          <PullQuote 
            quote="Working across different geographical locations has given me a unique perspective on building software that resonates with diverse user bases."
            align="center"
          />
          
          {/* Modern integrated experience section with tabs and content */}
          <div className="notes-card p-6 md:p-8 mt-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Tab Navigation - Left Side */}
              <div className="lg:w-1/4 grid grid-flow-col auto-cols-fr lg:grid-flow-row lg:auto-rows-auto overflow-x-auto scrollbar-hide lg:overflow-visible border-b lg:border-b-0 lg:border-r border-border">
                {experiences.map((exp, index) => (
                  <button
                    key={index}
                    className={`px-3 sm:px-4 py-3 text-left whitespace-nowrap transition-all min-w-[100px] lg:min-w-0 lg:w-full
                      ${activeCompany === exp.company 
                        ? 'border-b-2 lg:border-b-0 lg:border-l-2 border-secondary bg-secondary/5 text-secondary font-medium' 
                        : 'border-b-2 lg:border-b-0 lg:border-l-2 border-transparent hover:bg-primary/5 hover:text-text/90'
                      }`}
                    onClick={() => setActiveCompany(exp.company)}
                  >
                    <div className="flex flex-col">
                      <span className="text-base">{exp.company}</span>
                      <span className="text-xs text-muted-foreground mt-1.5">
                        {/* Split duration into parts and show start and end dates */}
                        {(() => {
                          const parts = exp.duration.split(' - ');
                          return (
                            <span className="whitespace-nowrap">
                              {parts[0]} 
                              {parts.length > 1 && (
                                <span className="hidden sm:inline"> - {parts[1]}</span>
                              )}
                              {parts.length > 1 && (
                                <span className="sm:hidden">
                                  <span className="inline-block text-secondary/60 mx-1">→</span>
                                  <span className="text-secondary">{parts[1]}</span>
                                </span>
                              )}
                            </span>
                          );
                        })()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Content - Right Side */}
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`lg:w-3/4 transition-opacity duration-300 ${
                    activeCompany === exp.company ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-text">
                        {exp.position} <span className="text-secondary">@ {exp.company}</span>
                      </h3>
                      
                      <div className="flex items-center gap-4 text-muted-foreground mt-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{exp.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mt-2">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-secondary flex-shrink-0 mt-1">▹</span>
                          <span className="text-text">{desc}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {exp.techs && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-medium text-text mb-3">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.techs.split(", ").map((tech, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key highlights section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Global Experience</h3>
              <p className="text-muted-foreground text-sm">
                Worked in 4 countries across Asia Pacific, Europe, and North America spanning 15+ years.
              </p>
            </div>
            
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9"></path><path d="m21.12 15.88-4.24 4.24a.5.5 0 0 1-.71 0l-2.12-2.12a.5.5 0 0 1 0-.71l4.24-4.24a.5.5 0 0 1 .71 0l2.12 2.12a.5.5 0 0 1 0 .71Z"></path></svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Optimization Expert</h3>
              <p className="text-muted-foreground text-sm">
                Reduced fraud by 30%+ at Stripe, saved $3M+ at Amazon, and improved UX across 5+ platforms.
              </p>
            </div>
            
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Team Leadership</h3>
              <p className="text-muted-foreground text-sm">
                Led teams of 4-10 engineers at Stripe, Amazon, and Avanade on mission-critical projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;