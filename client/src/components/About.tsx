import { useEffect } from "react";
import { useCustomInView } from "@/hooks/useCustomInView";
import { useSectionStore } from "@/lib/stores/useSectionStore";
import SectionHeading from "@/components/ui/section-heading";

const About = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("about");
    }
  }, [inView, setActiveSection]);

  // Animation will be handled with CSS instead of framer-motion

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 px-6 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeading title="About Me" number="01" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 opacity-100 transition-opacity duration-500">
          <div className="space-y-6 animate-fadeIn">
            <p className="text-text">
              Hello! I'm Jason, a seasoned Fullstack Software Engineer with a passion 
              for creating exceptional digital experiences that blend powerful functionality 
              with intuitive design.
            </p>
            
            <p className="text-text">
              With over 15 years in the tech industry, I've had the privilege of leading 
              and scaling distributed systems at renowned companies like 
              <span className="text-secondary"> Stripe</span> and
              <span className="text-secondary"> Amazon</span>, as well as innovative startups.
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

          <div className="space-y-8 animate-fadeIn delay-300">
            <h3 className="text-2xl font-bold text-text">Technical Proficiencies</h3>
            
            <div>
              <h4 className="text-xl text-secondary mb-4">Languages & Frameworks</h4>
              <ul className="grid grid-cols-2 gap-2 text-text">
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> TypeScript/JavaScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> React.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Node.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Java
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Ruby
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Python
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Kotlin
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> HTML5/CSS3
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl text-secondary mb-4">APIs & Communication</h4>
              <ul className="grid grid-cols-2 gap-2 text-text">
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> GraphQL
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> gRPC
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> REST
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl text-secondary mb-4">Cloud & DevOps</h4>
              <ul className="grid grid-cols-2 gap-2 text-text">
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> AWS
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Docker
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Terraform
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl text-secondary mb-4">Databases & Caching</h4>
              <ul className="grid grid-cols-2 gap-2 text-text">
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Redis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> DynamoDB
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Pinot
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> ElasticSearch
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">▹</span> Kafka
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
