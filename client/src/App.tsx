import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Canvas3D from "@/components/Canvas3D";
import ScrollControls from "@/components/ScrollControls";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useThemeStore } from "@/lib/stores/useThemeStore";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Setup theme
    document.documentElement.classList.add(theme);
    
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative z-0 bg-background">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="relative z-10">
              <Navbar />
              <div className="relative z-0">
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Contact />
                <Footer />
              </div>
            </div>
            
            <div className="fixed top-0 left-0 w-full h-full z-0">
              <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <ScrollControls>
                    <Canvas3D />
                  </ScrollControls>
                </Suspense>
              </Canvas>
            </div>
          </>
        )}
      </main>
    </QueryClientProvider>
  );
}

export default App;
