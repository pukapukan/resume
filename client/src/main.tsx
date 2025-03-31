import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from localStorage, system preference, or default to dark
const getInitialTheme = () => {
  // First check localStorage
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const parsedState = JSON.parse(savedTheme);
      return parsedState.state.theme;
    } catch (error) {
      console.warn('Error parsing stored theme:', error);
    }
  }
  
  // Then check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  // Default to dark theme
  return 'dark';
};

// Apply theme to document before rendering to prevent flash
const theme = getInitialTheme();
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(theme);

// Set additional properties for full theme consistency
if (theme === 'dark') {
  document.documentElement.style.colorScheme = 'dark';
  document.body.classList.add('dark');
} else {
  document.documentElement.style.colorScheme = 'light';
  document.body.classList.remove('dark');
}

console.log('Initial theme applied:', theme);

// Create React root and render app
createRoot(document.getElementById("root")!).render(<App />);
