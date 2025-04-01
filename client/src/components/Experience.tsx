import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { cn, scrollToSection } from "../lib/utils";
import Globe from "./Globe";

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
    duration: "06/2022 - 02/2025",
    description: [
      "Tech Lead for a project that scaled Stripe's fraud protection system, expanding supported payment methods by 50x. Led the initiative from ideation to technical design and development, culminating in a successful alpha/beta launch screening $10MM+ in transactions per day and reducing fraud rates by 30%+ on major payment methods.",
      "Designed and integrated a vision ML-based web app, specifically a card image verification application, into the Stripe ecosystem. The application screened fraudulent attempts using fake cards, significantly enhancing security. Conducted a full UX/UI overhaul and ran A/B tests that increased engagement by 20%.",
      "Awarded org-level recognition for entirely rewriting frontend developer experience setups. Replaced all manual dev steps with scripts/commands; moved all system variables to env variables via commands. Reduced dev ramp up time from days to minutes."
    ],
    techs: "Java, Ruby, TypeScript, React, GraphQL, gRPC, Node.js, TensorFlow.js"
  },
  {
    company: "Amazon",
    location: "Seattle/London",
    position: "Senior Software Engineer",
    duration: "11/2016 - 06/2022",
    description: [
      "Spearheaded cross-functional initiatives to optimize website latency, generating $30MM+ in annual revenue gains.",
      "Reduced API service traffic by 60% and cut hardware costs by $3M+ annually through strategic caching optimizations.",
      "Led a team of 5 engineers in enhancing the retail website experience for non-Prime customers, overseeing architecture, technical designs, and backend service deployment, significantly improving engagement."
    ],
    techs: "JavaScript, Java, Memcached"
  },
  {
    company: "Freelance",
    location: "Seoul (S.Korea)",
    position: "Full Stack Developer",
    duration: "03/2015 - 10/2016",
    description: [
      "Developed two API services and two content management systems for mobile apps used by multinational clients.",
      "Built three educational JavaScript-based online games for UK local councils.",
      "Designed and deployed a local community platform using Node.js, React.js, GraphQL, Redis, AWS."
    ],
    techs: "Node.js, React.js, GraphQL, Redis, AWS"
  },
  {
    company: "LateRooms.com",
    location: "Singapore",
    position: "Full Stack Developer",
    duration: "08/2014 - 02/2015",
    description: [
      "Modernized the account management service on a Node.js stack, improving user acquisition rates.",
      "Enhanced system architecture to support multiple brands, increasing code reusability."
    ],
    techs: "Node.js"
  },
  {
    company: "Avanade",
    location: "Singapore",
    position: "IT Consultant",
    duration: "05/2012 - 08/2014",
    description: [
      "Led a team of 10 engineers in delivering a 1000+ manday project for the Inland Revenue Authority of Singapore (IRAS), designing an online corporate income tax filing system on the .NET stack."
    ],
    techs: ".NET"
  }
];

const Experience = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (inView) {
      setActiveSection("experience");
    }
  }, [inView, setActiveSection]);

  // Animation is now handled with CSS instead of variants

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 px-6 min-h-screen flex items-center scroll-mt-24 overflow-hidden"
    >
      {/* Globe Background Component */}
      <Globe />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <SectionHeading title="Where I've Worked" number="02" />

        <div className={`mt-16 ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Tab Navigation */}
            <div className="flex flex-row md:flex-col overflow-x-auto scrollbar-hide border-b md:border-b-0 md:border-l border-border">
              {experiences.map((exp, index) => (
                <button
                  key={index}
                  className={cn(
                    "py-3 px-3 md:px-6 whitespace-nowrap font-mono text-sm transition-all relative min-w-[80px] text-center",
                    activeTab === index
                      ? "text-secondary bg-secondary/5 md:bg-transparent border-b-2 md:border-b-0 md:border-l-2 border-secondary md:-ml-[2px]"
                      : "text-text hover:bg-secondary/5 hover:text-secondary"
                  )}
                  onClick={() => setActiveTab(index)}
                >
                  {exp.company}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 min-h-[300px] md:min-h-[350px] transition-all duration-300 relative">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`experience-item transition-opacity duration-300 absolute w-full ${
                    activeTab === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-text flex flex-wrap">
                    <span className="mr-2">{exp.position}</span>
                    <span className="text-secondary company-name">@ {exp.company}</span>
                  </h3>
                  
                  <p className="text-muted-foreground font-mono mt-1 mb-4">
                    {exp.duration}
                  </p>
                  
                  <p className="text-text text-sm mb-2 italic">
                    {exp.location}
                  </p>
                  
                  <ul className="space-y-4 mt-6">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex gap-2 text-text">
                        <span className="text-secondary flex-shrink-0 mt-1">▹</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {exp.techs && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="text-secondary font-mono text-sm mb-2">
                        Technologies Used:
                      </h4>
                      <p className="text-muted-foreground">
                        {exp.techs}
                      </p>
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

export default Experience;
