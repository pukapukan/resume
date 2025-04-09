import { useState, useEffect, useRef } from "react";
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
  const [animProgress, setAnimProgress] = useState(0); // 0 to 1 animation progress
  const [heroNameRect, setHeroNameRect] = useState<DOMRect | null>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navRef = useRef<HTMLElement>(null);
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

  // Store the initial position of the hero name and navbar height
  useEffect(() => {
    const heroName = document.getElementById('hero-name');
    if (heroName) {
      setHeroNameRect(heroName.getBoundingClientRect());
    }
    
    if (navRef.current) {
      setNavbarHeight(navRef.current.offsetHeight);
    }
    
    // Update measurements on resize
    const handleResize = () => {
      if (heroName) {
        setHeroNameRect(heroName.getBoundingClientRect());
      }
      if (navRef.current) {
        setNavbarHeight(navRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Additional states for the flying name animation
  const [nameRect, setNameRect] = useState<DOMRect | null>(null);
  const [heroFontSize, setHeroFontSize] = useState<number>(0);
  const [navbarFontSize, setNavbarFontSize] = useState<number>(0);
  const [flyingName, setFlyingName] = useState<HTMLElement | null>(null);
  const [flyingNameVisible, setFlyingNameVisible] = useState(false);
  
  // Create the flying name element once on mount
  useEffect(() => {
    // Create a flying name element to animate between hero and navbar
    if (!flyingName) {
      const nameEl = document.createElement('div');
      nameEl.classList.add('fixed', 'pointer-events-none', 'font-bold', 'transition-all', 'duration-300', 'z-[60]');
      nameEl.innerHTML = '<span class="text-secondary">J</span>ason <span class="text-secondary">P</span>ark';
      nameEl.style.opacity = '0';
      document.body.appendChild(nameEl);
      setFlyingName(nameEl);
    }
    
    return () => {
      // Clean up on unmount
      if (flyingName) {
        document.body.removeChild(flyingName);
      }
    };
  }, []);
  
  // Handle scroll effects and animations
  useEffect(() => {
    const handleScroll = () => {
      // Get the hero name element and navbar name element
      const heroName = document.getElementById('hero-name');
      const navbarNameEl = document.querySelector('nav a[href="#hero"]') as HTMLElement;
      
      if (heroName && navbarNameEl && flyingName) {
        // Get current positions and dimensions
        const heroRect = heroName.getBoundingClientRect();
        const navRect = navbarNameEl.getBoundingClientRect();
        
        // Measure sizes if not already done
        if (heroFontSize === 0) {
          const heroStyle = window.getComputedStyle(heroName);
          setHeroFontSize(parseFloat(heroStyle.fontSize));
          
          const navStyle = window.getComputedStyle(navbarNameEl);
          setNavbarFontSize(parseFloat(navStyle.fontSize));
        }
        
        // Calculate animation progress based on hero element position
        const scrollThreshold = window.innerHeight * 0.4;
        
        // Calculate animation progress (0 to 1)
        let progress = 0;
        if (heroRect.top < scrollThreshold) {
          // Calculate how far we've scrolled past threshold
          const scrollDist = scrollThreshold - heroRect.top;
          const maxDist = scrollThreshold + 100; // Complete animation over 100px of scroll
          progress = Math.min(1, scrollDist / maxDist);
        }
        
        // Set animation progress for other components
        setAnimProgress(progress);
        
        // Only show flying name during transition
        if (progress > 0 && progress < 1) {
          // Calculate intermediate position
          const x = heroRect.left + (navRect.left - heroRect.left) * progress;
          const y = heroRect.top + (navRect.top - heroRect.top) * progress;
          
          // Calculate intermediate size
          const fontSize = heroFontSize + (navbarFontSize - heroFontSize) * progress;
          
          // Apply to flying element
          flyingName.style.left = `${x}px`;
          flyingName.style.top = `${y}px`;
          flyingName.style.fontSize = `${fontSize}px`;
          flyingName.style.opacity = '1';
          
          // Make sure hero title and navbar title are hidden during transition
          heroName.style.opacity = `${1 - progress}`;
          navbarNameEl.style.opacity = '0';
          
          setFlyingNameVisible(true);
        } else if (progress >= 1) {
          // We've completed the animation, hide flying element, show navbar
          flyingName.style.opacity = '0';
          heroName.style.opacity = '0';
          navbarNameEl.style.opacity = '1';
          setFlyingNameVisible(false);
        } else {
          // We're at the top, reset everything
          flyingName.style.opacity = '0';
          heroName.style.opacity = '1';
          navbarNameEl.style.opacity = '0';
          setFlyingNameVisible(false);
        }
        
        // Check if we've scrolled past the hero section to show navbar
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const aboutSectionTop = aboutSection.getBoundingClientRect().top;
          // Show navbar when about section is near the top of the viewport
          setIsScrolled(aboutSectionTop <= navbarHeight * 2 || progress > 0.8);
        } else {
          // Fallback to basic scroll detection
          setIsScrolled(progress > 0.8);
        }
      } else {
        // Fallback if elements not found
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const aboutSectionTop = aboutSection.getBoundingClientRect().top;
          setIsScrolled(aboutSectionTop <= 0 || window.scrollY > window.innerHeight * 0.8);
        } else {
          setIsScrolled(window.scrollY > window.innerHeight * 0.8);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Run once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroNameRect, navbarHeight, heroFontSize, flyingName]);

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
      ref={navRef}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled || isMenuOpen
          ? "opacity-100 translate-y-0 bg-background/90 backdrop-blur-md border-b border-border/30 py-3 shadow-sm" 
          : isMobile
            ? "opacity-100 translate-y-0 bg-transparent py-5" // Keep nav visible on mobile but name will be hidden
            : "opacity-0 -translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Animated name that morphs from hero to navbar */}
        <a 
          href="#hero" 
          className={cn(
            "transition-all duration-300 font-medium tracking-tight overflow-hidden relative whitespace-nowrap",
            isScrolled || !isMobile
              ? "opacity-100"
              : isMobile && animProgress > 0 
                ? "opacity-100" 
                : "opacity-0" // Hide when not scrolled and no animation
          )}
          style={{
            // Dynamic font size based on animation progress
            fontSize: isMobile
              ? `${Math.max(0.9, 1.5 - animProgress * 0.6)}rem` // Shrink from larger to smaller
              : "1rem",
            // Scale and transform as we scroll
            transform: isMobile && heroNameRect 
              ? `
                scale(${1 - (animProgress * 0.2)})
                translateY(${Math.max(0, (1 - animProgress) * -20)}px)
              ` 
              : "none"
          }}
          onClick={(e) => handleNavClick(e, "hero")}
        >
          <span className="transition-all duration-500" style={{
            // Optionally change colors during transition
            color: animProgress > 0.5 ? 'var(--color-secondary)' : 'var(--color-secondary)'
          }}>J</span>
          <span className="transition-all duration-500" style={{
            color: animProgress > 0.5 ? 'var(--color-text)' : 'var(--color-text)'
          }}>ason </span>
          <span className="transition-all duration-500" style={{
            color: animProgress > 0.5 ? 'var(--color-secondary)' : 'var(--color-secondary)'
          }}>P</span>
          <span className="transition-all duration-500" style={{
            color: animProgress > 0.5 ? 'var(--color-text)' : 'var(--color-text)'
          }}>ark</span>
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

        {/* Mobile Nav Toggle - Always visible */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-text/70 hover:text-text transition-colors opacity-100"
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
              "p-1.5 transition-colors opacity-100",
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
