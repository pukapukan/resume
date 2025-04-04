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
    location: "San Francisco, CA",
    position: "Lead Software Engineer",
    duration: "Jan 2018 - Present",
    description: [
      "Led the scaling of Stripe's fraud protection system, expanding supported payment methods by 50x.",
      "Successfully launched alpha/beta deployments, screening $10MM+ in transactions per day and reducing fraud rates by 30%+ on major payment methods.",
      "Designed and integrated a vision ML-based web app for card verification into the Stripe ecosystem.",
      "Managed and mentored a team of 6 engineers, leading with a focus on innovation and high-quality code.",
    ],
    techs: "Java, Ruby, Node.js, React, TypeScript, GraphQL, TensorFlow.js"
  },
  {
    company: "Amazon",
    location: "Seattle, WA",
    position: "Senior Software Engineer",
    duration: "Mar 2015 - Dec 2017",
    description: [
      "Spearheaded cross-functional initiatives to optimize website latency, generating $30MM+ in annual revenue gains.",
      "Developed and implemented performance metrics and monitoring systems that provided real-time insights.",
      "Led a team of 4 engineers focused on customer-facing web applications and internal tools.",
      "Collaborated with product and design teams to create intuitive user experiences."
    ],
    techs: "Java, JavaScript, AWS, React, Redux"
  },
  {
    company: "Freelance",
    location: "Remote",
    position: "Fullstack Developer",
    duration: "Jan 2013 - Feb 2015",
    description: [
      "Provided full-stack development services for multiple clients across various industries.",
      "Built a community platform for connecting local residents and businesses.",
      "Developed custom e-commerce solutions and content management systems.",
      "Consulted on technical architecture and technology selection for startups."
    ],
    techs: "Node.js, React, MongoDB, Express, PostgreSQL"
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
              <div className="lg:w-1/4 flex lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-border">
                {experiences.map((exp, index) => (
                  <button
                    key={index}
                    className={`px-4 py-3 text-left whitespace-nowrap transition-all flex-shrink-0 lg:flex-shrink lg:w-full
                      ${activeCompany === exp.company 
                        ? 'border-b-2 lg:border-b-0 lg:border-l-2 border-secondary bg-secondary/5 text-secondary font-medium' 
                        : 'border-b-2 lg:border-b-0 lg:border-l-2 border-transparent hover:bg-primary/5 hover:text-text/90'
                      }`}
                    onClick={() => setActiveCompany(exp.company)}
                  >
                    <div className="flex flex-col">
                      <span className="text-base">{exp.company}</span>
                      <span className="text-xs text-muted-foreground mt-1">{exp.duration.split(' - ')[0]}</span>
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
                    
                    {/* Location card - integrated within each experience */}
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <div className="rounded-lg bg-primary/5 p-4 mt-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                            <MapPin size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-text">{exp.location}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {exp.company === "Stripe" && "Headquarters of Stripe's global payment operations."}
                              {exp.company === "Amazon" && "Hub for Amazon's retail tech innovation."}
                              {exp.company === "Freelance" && "Worked remotely with clients worldwide."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key highlights section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Briefcase size={20} />
              </div>
              <h3 className="font-medium text-lg mb-2">Global Companies</h3>
              <p className="text-muted-foreground text-sm">
                Experience working with industry leaders and innovative startups across different markets.
              </p>
            </div>
            
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Cross-Functional</h3>
              <p className="text-muted-foreground text-sm">
                Collaborated with product, design, and business teams to deliver impactful software solutions.
              </p>
            </div>
            
            <div className="notes-card p-5">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Leadership</h3>
              <p className="text-muted-foreground text-sm">
                Led engineering teams focused on critical business objectives and technical excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;