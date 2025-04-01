import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getLocalStorage = (key: string): any =>
  JSON.parse(window.localStorage.getItem(key) || "null");
const setLocalStorage = (key: string, value: any): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

/**
 * Utility function to scroll to a section smoothly with proper offset calculation
 */
export function scrollToSection(sectionId: string): void {
  console.log(`Attempting to scroll to section: ${sectionId}`);
  
  // Use setTimeout to ensure DOM is fully rendered, especially when using libraries like framer-motion
  setTimeout(() => {
    // Find the target element
    const element = document.getElementById(sectionId);
    
    if (!element) {
      console.error(`Element with id "${sectionId}" not found. Available IDs:`, 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      return;
    }
    
    // Get the navbar height for offset calculation
    const navbar = document.querySelector('nav');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Calculate the element's position with getBoundingClientRect()
    const elementRect = element.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const absoluteElementTop = elementRect.top + scrollY;
    const offsetPosition = absoluteElementTop - navbarHeight - 20;
    
    console.log(`Scrolling to section ${sectionId} at position: ${offsetPosition}`);
    
    try {
      // Attempt to scroll with smooth behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Fallback to ensure we get to the right position even if smooth scrolling fails
      setTimeout(() => {
        if (Math.abs(window.scrollY - offsetPosition) > 50) {
          console.log("Smooth scroll may have failed, using fallback");
          window.scrollTo(0, offsetPosition);
        }
      }, 500);
      
      console.log(`Navigation complete to section: ${sectionId}`);
    } catch (error) {
      console.error("Error during scroll:", error);
      // Hard fallback
      window.scrollTo(0, offsetPosition);
    }
  }, 50); // Small delay to ensure rendering is complete
}

export { getLocalStorage, setLocalStorage };
