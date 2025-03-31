import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "./lib/stores/useThemeStore";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  
  // Preload critical assets
  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    // Handle theme changes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Also update body and html styles for complete theme consistency
    if (theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
      document.body.classList.add('dark');
    } else {
      document.documentElement.style.colorScheme = 'light';
      document.body.classList.remove('dark');
    }
    
    console.log('Theme changed to:', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative z-0 bg-background">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="relative">
            <Navbar />
            <div>
              <Hero />
              <About />
              <Experience />
              <Projects />
              <Contact />
              <Footer />
            </div>
          </div>
        )}
      </main>
    </QueryClientProvider>
  );
}

export default App;