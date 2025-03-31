import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/stores/useThemeStore";
import { useSectionStore } from "@/lib/stores/useSectionStore";
import { Moon, Sun, Menu, X } from "lucide-react";

interface NavLink {
  id: string;
  title: string;
}

const navLinks: NavLink[] = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
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

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    
    // Make sure we're setting the time of the last click to avoid automatic section detection
    useSectionStore.getState().setTimeOfLastClick(Date.now());
    
    // Find the element and scroll to it
    const element = document.getElementById(id);
    if (element) {
      // Use window.scrollTo for more consistent scrolling behavior
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - 100, // Offset to account for fixed navbar
        behavior: "smooth"
      });
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
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
          onClick={() => handleNavClick("hero")}
        >
          Jason Park
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
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
                  onClick={() => handleNavClick(link.id)}
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
