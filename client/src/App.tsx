import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "./lib/stores/useThemeStore";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  
  // Preload critical assets with a shorter loading time
  useEffect(() => {
    // Simulate asset loading - brief loading time for better user experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds is enough to show animation without frustrating users
    
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

  // Content fade-in animation
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative z-0 bg-background">
        {isLoading ? (
          <Loader />
        ) : (
          <motion.div 
            className="relative"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <Navbar />
            <div>
              <Hero />
              <About />
              <Experience />
              <Projects />
              <Resume />
              <Contact />
              <Footer />
            </div>
          </motion.div>
        )}
      </main>
    </QueryClientProvider>
  );
}

export default App;