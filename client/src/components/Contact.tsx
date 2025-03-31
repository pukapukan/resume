import { useEffect, useState } from "react";
import { useCustomInView } from "../hooks/useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";
import { scrollToSection } from "../lib/utils";
import SectionHeading from "./ui/section-heading";
import { Mail, Linkedin, Github } from "lucide-react";

const Contact = () => {
  const { setActiveSection } = useSectionStore();
  const { ref, inView } = useCustomInView({
    threshold: 0.3,
    respectClickState: true
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inView) {
      setActiveSection("contact");
    }
  }, [inView, setActiveSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    // Simulate sending email with timeout
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 px-6 min-h-[80vh] flex items-center"
    >
      <div className="max-w-3xl mx-auto w-full">
        <SectionHeading title="Get In Touch" number="04" center />

        <div className={`mt-12 text-center ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>
          <p className="text-text text-lg mb-8">
            I'm currently open to new opportunities and would love to hear from you.
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a
              href="mailto:jason.hyunjoon.park@gmail.com"
              className="text-text hover:text-secondary transition-colors p-2"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
            <a
              href="https://linkedin.com/in/jasonhjpark"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition-colors p-2"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition-colors p-2"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
          </div>

          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-xl mx-auto transition-opacity duration-500 ease-in-out"
            >
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-text text-left">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-3 text-text focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-text text-left">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-3 text-text focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-text text-left">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-card border border-border rounded-md p-3 text-text focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-background font-bold py-3 px-4 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          ) : (
            <div
              className="bg-secondary/10 border border-secondary rounded-md p-8 text-center transition-all duration-500 ease-in-out"
            >
              <h3 className="text-2xl font-bold text-text mb-2">Thank you!</h3>
              <p className="text-text">
                Your message has been sent. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 border border-secondary text-secondary px-4 py-2 rounded-md hover:bg-secondary/10 transition-colors"
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
