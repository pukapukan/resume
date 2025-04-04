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
  
  // Debug mobile menu state
  useEffect(() => {
    console.log("Mobile menu state:", isMenuOpen ? "open" : "closed");
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const aboutSectionTop = aboutSection.getBoundingClientRect().top;
        // Show navbar when about section is at or above the top of the viewport
        setIsScrolled(aboutSectionTop <= 0 || window.scrollY > window.innerHeight * 0.8);
      } else {
        // Fallback to basic scroll distance if section not found
        setIsScrolled(window.scrollY > window.innerHeight * 0.8);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Run once on mount to set initial state
    handleScroll();
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
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled || isMenuOpen
          ? "opacity-100 translate-y-0 bg-background/90 backdrop-blur-md border-b border-border/30 py-3 shadow-sm" 
          : isMobile
            ? "opacity-100 translate-y-0 bg-transparent py-5"
            : "opacity-0 -translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <a 
          href="#hero" 
          className="text-text/90 hover:text-secondary transition-colors duration-300 text-lg font-medium tracking-tight"
          onClick={(e) => handleNavClick(e, "hero")}
        >
          <span className="text-secondary">J</span>ason <span className="text-secondary">P</span>ark
        </a>

        {/* Desktop Nav - More minimalistic */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-5">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <button
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "text-sm transition-colors duration-300",
                    activeSection === link.id
                      ? "text-secondary font-medium"
                      : "text-text/80 hover:text-text"
                  )}
                >
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="h-5 w-[1px] bg-border/40 mx-1"></div>
          
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-text/70 hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-text/70 hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            onClick={() => {
              console.log("Toggle mobile menu from", isMenuOpen, "to", !isMenuOpen);
              setIsMenuOpen(prev => !prev);
            }}
            className={cn(
              "p-1.5 transition-colors",
              isMenuOpen 
                ? "text-secondary" 
                : "text-text/70 hover:text-text"
            )}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Always in DOM but conditionally displayed */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 top-[58px] bg-background z-40 flex flex-col items-center justify-start pt-8 overflow-y-auto",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        style={{
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          height: "calc(100vh - 58px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#0A192F", // Hardcoded background color for mobile
          borderTop: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <div className="w-full max-w-md mx-auto px-6 py-8">
          <ul className="flex flex-col items-center gap-5">
            {navLinks.map((link, index) => (
              <li key={link.id} className="w-full text-center">
                <button
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "transition-colors duration-300 py-4 px-6 w-full rounded",
                    activeSection === link.id
                      ? "text-secondary" 
                      : "text-text/80 hover:text-text"
                  )}
                >
                  {link.title}
                </button>
                {index < navLinks.length - 1 && (
                  <div className="h-[1px] w-3/4 mx-auto bg-border/20 mt-4" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
