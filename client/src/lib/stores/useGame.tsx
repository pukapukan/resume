import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";
import { useAudio } from "./useAudio";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  
  // Game stats
  score: number;
  highScore: number;
  interactionCount: number;
  lastInteractionTime: number;
  
  // Game objects state
  activeCube: string | null;
  cubeRotationSpeed: number;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  incrementScore: (points?: number) => void;
  resetScore: () => void;
  incrementInteraction: () => void;
  setActiveCube: (cubeId: string | null) => void;
  setCubeRotationSpeed: (speed: number) => void;
}

// Local storage keys
const GAME_STATE_KEY = "portfolio_game_state";
const HIGH_SCORE_KEY = "portfolio_high_score";

// Load saved high score from local storage if available
const savedHighScore = getLocalStorage(HIGH_SCORE_KEY) || 0;

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    score: 0,
    highScore: savedHighScore,
    interactionCount: 0,
    lastInteractionTime: 0,
    activeCube: null,
    cubeRotationSpeed: 0.01,
    
    start: () => {
      // Play audio when game starts
      const audioState = useAudio.getState();
      
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          // Try to play background music
          if (audioState.backgroundMusic) {
            audioState.playBackgroundMusic();
          }
          
          return { 
            phase: "playing",
            score: 0,
            interactionCount: 0,
            lastInteractionTime: Date.now()
          };
        }
        return {};
      });
    },
    
    restart: () => {
      // Play audio when game restarts
      const audioState = useAudio.getState();
      audioState.playHit();
      
      set(() => ({ 
        phase: "ready",
        score: 0,
        interactionCount: 0,
        activeCube: null
      }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          // Get audio state
          const audioState = useAudio.getState();
          
          // Check for new high score
          const newHighScore = state.score > state.highScore ? state.score : state.highScore;
          
          // Save high score to localStorage
          if (newHighScore > state.highScore) {
            setLocalStorage(HIGH_SCORE_KEY, newHighScore);
            // Play success sound for new high score
            audioState.playSuccess();
          }
          
          // Pause background music when game ends
          if (audioState.backgroundMusic) {
            audioState.pauseBackgroundMusic();
          }
          
          return { 
            phase: "ended",
            highScore: newHighScore
          };
        }
        return {};
      });
    },
    
    incrementScore: (points = 1) => {
      // Play hit sound when score is incremented
      const audioState = useAudio.getState();
      audioState.playHit();
      
      set((state) => {
        const newScore = state.score + points;
        return { score: newScore };
      });
    },
    
    resetScore: () => {
      set({ score: 0 });
    },
    
    incrementInteraction: () => {
      // Play hit sound for interactions
      const audioState = useAudio.getState();
      audioState.playHit();
      
      set((state) => {
        const newCount = state.interactionCount + 1;
        return { 
          interactionCount: newCount,
          lastInteractionTime: Date.now()
        };
      });
    },
    
    setActiveCube: (cubeId) => {
      const prevCube = get().activeCube;
      
      // Only play sound when setting a new cube (not when clearing)
      if (cubeId && cubeId !== prevCube) {
        // Play hit sound when selecting a cube
        const audioState = useAudio.getState();
        audioState.playHit();
      }
      
      set({ activeCube: cubeId });
    },
    
    setCubeRotationSpeed: (speed) => {
      set({ cubeRotationSpeed: speed });
    }
  }))
);
