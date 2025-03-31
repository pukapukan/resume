import { useEffect, useState } from 'react';
import { useGame } from '../../lib/stores/useGame';
import { useThemeStore } from '../../lib/stores/useThemeStore';
import { useAudio } from '../../lib/stores/useAudio';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';

const GameStatus = () => {
  const { phase, score, highScore, interactionCount } = useGame();
  const { theme, toggleTheme } = useThemeStore();
  const { isMuted, toggleMute } = useAudio();
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation to fade in the component
  useEffect(() => {
    if (phase === 'playing') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [phase]);
  
  // Don't render if not in playing phase
  if (phase !== 'playing') {
    return null;
  }
  
  return (
    <div 
      className={`fixed top-4 right-4 bg-background/80 backdrop-blur-sm 
                 border border-border rounded-lg p-3 z-50
                 transition-opacity duration-500 ease-in-out
                 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-foreground">Interactive Mode</h3>
          <div className="flex gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {/* Sound toggle */}
            <button
              onClick={toggleMute}
              className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${isMuted ? 'Unmute' : 'Mute'} sound`}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Score</span>
            <span className="font-medium text-foreground">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">High Score</span>
            <span className="font-medium text-foreground">{highScore}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Interactions</span>
            <span className="font-medium text-foreground">{interactionCount}</span>
          </div>
        </div>
        
        <div className="mt-2 text-[10px] text-muted-foreground">
          <p>Click on skills cubes to interact</p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;