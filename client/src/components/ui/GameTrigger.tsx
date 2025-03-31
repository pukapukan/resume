import { useEffect, useState } from 'react';
import { Gamepad2, X } from 'lucide-react';
import { useGame } from '../../lib/stores/useGame';
import { useAudio } from '../../lib/stores/useAudio';
import { cn } from '../../lib/utils';

const GameTrigger = () => {
  const { phase, start, end } = useGame();
  const { playHit } = useAudio();
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Show info popup after a delay
  useEffect(() => {
    if (phase === 'ready' && !showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [phase, showInfo]);
  
  const handleTriggerClick = () => {
    playHit();
    
    if (phase === 'ready') {
      start();
    } else if (phase === 'playing') {
      end();
    }
    
    // Hide info when clicked
    setShowInfo(false);
  };
  
  // Pulsating animation class for the button
  const pulseClass = phase === 'ready' ? 'animate-pulse' : '';
  const hoverClass = isHovered 
    ? 'bg-primary/90 text-primary-foreground scale-110' 
    : 'bg-primary/20 text-primary hover:bg-primary/30';
  
  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Info popup */}
      {showInfo && phase === 'ready' && (
        <div className="absolute bottom-16 right-0 mb-2 p-3 bg-card border border-border rounded-lg shadow-md w-64 text-sm animate-fade-in">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Close info"
          >
            <X size={14} />
          </button>
          <p className="text-foreground font-medium mb-1">Interactive Mode Available</p>
          <p className="text-muted-foreground text-xs">
            Click the gamepad icon to explore Jason's skills in an interactive 3D format!
          </p>
        </div>
      )}
      
      <button
        className={cn(
          "rounded-full p-3 transition-all duration-300 shadow-md",
          hoverClass,
          pulseClass
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTriggerClick}
        aria-label={phase === 'ready' ? "Enter interactive mode" : "Exit interactive mode"}
      >
        <Gamepad2 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GameTrigger;