import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { ChevronRight, Briefcase, Calendar, MapPin } from "lucide-react";
import PullQuote from "./ui/pull-quote";
import MapGlobe from "./MapGlobe";

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
  const [showContent, setShowContent] = useState(false);
  const [activeCompany, setActiveCompany] = useState("Stripe");

  useEffect(() => {
    if (inView) {
      setActiveSection("experience");
      if (!showContent) {
        setTimeout(() => setShowContent(true), 200);
      }
    }
  }, [inView, setActiveSection, showContent]);

  return (
    <section
      id="experience"
      ref={setExpRef as any}
      className="relative py-24 min-h-screen scroll-mt-24"
    >
      <div className="notes-container">
        <SectionHeading title="Where I've Worked" number="02" />

        <div className={`mt-16 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* MapBox will go here once we have the token */}
          <div className="h-[300px] md:h-[500px] bg-card border border-border rounded-lg mb-16 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p>Interactive map loading... (Requires MapBox access token)</p>
            </div>
            <MapGlobe 
              activeCompany={activeCompany}
              onCompanyChange={setActiveCompany}
            />
          </div>

          {/* Gates Notes-style quote */}
          <PullQuote 
            quote="Working across different geographical locations has given me a unique perspective on building software that resonates with diverse user bases."
            align="center"
          />
          
          {/* Experience Timeline - Gates Notes style */}
          <div className="notes-card p-8 md:p-12 mt-16">
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-300 ${
                    activeCompany === exp.company 
                      ? 'bg-primary/5 p-6 rounded-lg shadow-sm border border-secondary/20' 
                      : 'p-4'
                  }`}
                >
                  <div 
                    className="flex flex-col md:flex-row gap-4 md:gap-8 cursor-pointer"
                    onClick={() => setActiveCompany(exp.company)}
                  >
                    <div className="md:w-1/3 space-y-3">
                      <div className="flex items-center gap-2 text-secondary font-medium">
                        <Briefcase size={18} />
                        <h3 className="text-xl">{exp.company}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar size={16} />
                        <span>{exp.duration}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin size={16} />
                        <span>{exp.location}</span>
                      </div>
                      
                      <div className="font-medium text-text mt-2">
                        {exp.position}
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <ul className="space-y-3">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex">
                            <span className="text-secondary mr-2 mt-1">▹</span>
                            <span className="text-text">{desc}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {exp.techs && (
                        <div className="mt-4 pt-4 border-t border-primary/10">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.techs.split(", ").map((tech, i) => (
                              <span 
                                key={i} 
                                className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;