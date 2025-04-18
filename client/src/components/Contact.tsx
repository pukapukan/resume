import { useEffect } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import SectionHeading from "./ui/section-heading";
import { Mail, Linkedin } from "lucide-react";

const Contact = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("contact");
    }
  }, [inView, setActiveSection]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 px-6 min-h-[80vh] flex items-center scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto w-full">
        <SectionHeading title="Get In Touch" number="04" />

        <div className={`mt-12 text-center ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>
          <p className="text-text text-lg mb-8">
            Thanks for taking the time to review my portfolio. If you'd like to connect 
            or discuss anything you've seen here, please feel free to reach out.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <Mail size={24} className="text-secondary" />
              <a
                href="mailto:jason.hyunjoon.park@gmail.com"
                className="text-text hover:text-secondary transition-colors font-medium"
                aria-label="Email"
              >
                jason.hyunjoon.park@gmail.com
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <Linkedin size={24} className="text-secondary" />
              <a
                href="https://www.linkedin.com/in/jasonhyunjoonpark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:text-secondary transition-colors font-medium"
                aria-label="LinkedIn"
              >
                linkedin.com/in/jasonhyunjoonpark
              </a>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mt-12">
            Whether it's a professional inquiry or just to say hello, I'll do my best to respond promptly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
