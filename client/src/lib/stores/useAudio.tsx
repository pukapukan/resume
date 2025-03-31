import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  bgMusicPlaying: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Start with sound enabled
  bgMusicPlaying: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state for both store and actual audio elements
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState;
    }
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      try {
        // Clone the sound to allow overlapping playback
        const soundClone = hitSound.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.3;
        soundClone.play().catch(error => {
          console.log("Hit sound play prevented:", error);
        });
      } catch (err) {
        // Fallback if cloning fails
        hitSound.currentTime = 0;
        hitSound.play().catch(err => console.warn('Error playing hit sound:', err));
      }
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      try {
        successSound.currentTime = 0;
        successSound.volume = 0.7;
        successSound.play().catch(error => {
          console.log("Success sound play prevented:", error);
        });
      } catch (err) {
        console.warn('Could not play success sound:', err);
      }
    }
  },
  
  playBackgroundMusic: () => {
    const { backgroundMusic, isMuted, bgMusicPlaying } = get();
    
    if (backgroundMusic && !bgMusicPlaying) {
      backgroundMusic.muted = isMuted;
      backgroundMusic.volume = 0.3; // Low volume for background music
      backgroundMusic.loop = true;
      
      // Use a promise to handle autoplay restrictions
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            set({ bgMusicPlaying: true });
            console.log('Background music started');
          })
          .catch(err => {
            // Autoplay was prevented, we'll need user interaction
            console.warn('Background music autoplay prevented:', err);
          });
      }
    }
  },
  
  pauseBackgroundMusic: () => {
    const { backgroundMusic } = get();
    
    if (backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
      set({ bgMusicPlaying: false });
      console.log('Background music paused');
    }
  },
  
  toggleBackgroundMusic: () => {
    const { bgMusicPlaying } = get();
    const { playBackgroundMusic, pauseBackgroundMusic } = get();
    
    if (bgMusicPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  }
}));
