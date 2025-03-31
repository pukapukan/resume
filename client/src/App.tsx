import { Suspense, useEffect, useState, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollControls from "./components/ScrollControls";
import GameTrigger from "./components/ui/GameTrigger";
import GameStatus from "./components/ui/GameStatus";
import AudioLoader from "./components/AudioLoader";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "./lib/stores/useThemeStore";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";

// Lazy load 3D components for better initial load performance
const Canvas3D = lazy(() => import("./components/Canvas3D"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  const { phase, start } = useGame();
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Preload critical assets
  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
      start(); // Start the game/experience when loaded
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [start]);
  
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
        {/* Hidden component to handle audio preloading */}
        <AudioLoader />
        
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
            
            {/* Game UI elements */}
            {!isLoading && (
              <>
                <GameTrigger />
                <GameStatus />
              </>
            )}
            
            {/* Only render canvas if the game phase is ready or playing */}
            {(phase === 'ready' || phase === 'playing') && (
              <div className="fixed top-0 left-0 w-full h-full z-0">
                <Canvas
                  shadows
                  dpr={[1, 2]}
                  gl={{ 
                    alpha: true, 
                    antialias: true,
                    depth: true,
                    powerPreference: 'high-performance'
                  }}
                  camera={{
                    position: [0, 0, 5] as [number, number, number],
                    fov: 75,
                    near: 0.1,
                    far: 1000
                  }}
                  onCreated={() => setCanvasReady(true)}
                  className="w-full h-full"
                >
                  <Suspense fallback={null}>
                    {canvasReady && (
                      <ScrollControls>
                        <Canvas3D />
                      </ScrollControls>
                    )}
                  </Suspense>
                </Canvas>
              </div>
            )}
          </>
        )}
      </main>
    </QueryClientProvider>
  );
}

export default App;