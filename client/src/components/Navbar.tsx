import { useState, useEffect } from "react";
import { cn, scrollToSection } from "../lib/utils";
import { useThemeStore } from "../lib/stores/useThemeStore";
import { useSectionStore } from "../lib/stores/useSectionStore";
import { Moon, Sun, Menu, X } from "lucide-react";

interface NavLink {
  id: string;
  title: string;
}

const navLinks: NavLink[] = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "resume", title: "Resume" },
  { id: "contact", title: "Contact" }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { activeSection, setActiveSection } = useSectionStore();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent default hash navigation
    console.log(`Navbar: clicking on ${id} section`);
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // First, set the active section in the store
    setActiveSection(id);
    
    // Mark this as a manual navigation
    useSectionStore.getState().setTimeOfLastClick(Date.now());
    
    // Find the section element
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      console.log(`Found section element: ${id}`);
      
      try {
        // Try multiple ways to ensure scrolling works
        
        // 1. Direct scrollIntoView (most reliable)
        sectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        
        // 2. Update hash in URL (fallback)
        setTimeout(() => {
          window.location.hash = id;
        }, 100);
        
        // 3. Try simple scroll if needed
        setTimeout(() => {
          const yOffset = sectionElement.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: yOffset, behavior: 'smooth' });
        }, 200);
        
      } catch (error) {
        console.error('Error during scroll:', error);
        // Ultimate fallback
        window.location.hash = id;
      }
    } else {
      console.error(`Section with id "${id}" not found`);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full py-5 z-50 transition-all duration-300",
        isScrolled || isMenuOpen || isMobile
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <a 
          href="#hero" 
          className="text-secondary font-mono text-xl font-bold"
          onClick={(e) => handleNavClick(e, "hero")}
        >
          Jason Park
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <button
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "font-mono transition-colors duration-300 px-1",
                    activeSection === link.id
                      ? "text-secondary"
                      : "text-text hover:text-secondary"
                  )}
                >
                  <span className="text-secondary">0{index + 1}.</span> {link.title}
                </button>
              </li>
            ))}
          </ul>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary/10 text-text hover:bg-primary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary/10 text-text hover:bg-primary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-primary/10 text-text hover:text-secondary transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-md border-t border-border z-40 flex flex-col items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md mx-auto px-6 py-12">
            <ul className="flex flex-col items-center gap-10">
              {navLinks.map((link, index) => (
                <li key={link.id}>
                  <button
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={cn(
                      "font-mono text-lg transition-colors duration-300 py-3 px-4",
                      activeSection === link.id
                        ? "text-secondary"
                        : "text-text hover:text-secondary"
                    )}
                  >
                    <span className="text-secondary">0{index + 1}.</span> {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
