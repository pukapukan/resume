import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
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
  const { theme, toggleTheme } = useThemeStore();
  const { activeSection, setActiveSection } = useSectionStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent default hash navigation
    console.log(`Attempting to navigate to section: ${id}`);
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // First, set the active section in the store
    setActiveSection(id);
    
    // Mark this as a manual navigation
    useSectionStore.getState().setTimeOfLastClick(Date.now());
    
    // Find the target element
    const element = document.getElementById(id);
    
    if (!element) {
      console.error(`Element with id "${id}" not found. Available IDs:`, 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      return;
    }
    
    // Get the navbar height for offset calculation
    const navbar = document.querySelector('nav');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Calculate the element's position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
    
    // Scroll to the element with the calculated offset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    console.log(`Navigation complete to section: ${id}`);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full py-5 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/90 backdrop-blur-md border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
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
            className="text-text hover:text-secondary transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-background/95 backdrop-blur-md border-t border-border z-40 flex flex-col items-center justify-center">
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <button
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={cn(
                    "font-mono text-lg transition-colors duration-300",
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
      )}
    </nav>
  );
};

export default Navbar;
