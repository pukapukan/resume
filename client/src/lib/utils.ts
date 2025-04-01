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
 * Utility function to scroll to a section using the browser's native scrollIntoView
 * This is much more reliable than custom scroll calculations
 */
export function scrollToSection(sectionId: string): void {
  console.log(`Attempting to scroll to section: ${sectionId}`);
  
  // Find the target element
  const element = document.getElementById(sectionId);
  
  if (!element) {
    console.error(`Element with id "${sectionId}" not found. Available IDs:`, 
      Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    return;
  }
  
  try {
    // Directly use the browser's scrollIntoView functionality
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // If smooth scrolling fails, provide a fallback
    setTimeout(() => {
      if (!isElementInViewport(element)) {
        console.log("Using fallback scroll method");
        // Force scroll to element
        element.scrollIntoView(true);
      }
    }, 300);
    
    console.log(`Navigation complete to section: ${sectionId}`);
  } catch (error) {
    console.error("Error during scroll:", error);
    // Hard fallback
    element.scrollIntoView(true);
  }
}

/**
 * Helper function to check if an element is in the viewport
 */
function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export { getLocalStorage, setLocalStorage };
