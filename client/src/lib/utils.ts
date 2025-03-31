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
  
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
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
    
    // Get current scroll position
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Calculate the element's position relative to the document
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + scrollY;
    const offsetPosition = absoluteElementTop - navbarHeight - 20;
    
    console.log(`Scrolling to section ${sectionId} at position: ${offsetPosition}`);
    
    // Scroll to the element with the calculated offset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    console.log(`Navigation complete to section: ${sectionId}`);
  });
}

export { getLocalStorage, setLocalStorage };
