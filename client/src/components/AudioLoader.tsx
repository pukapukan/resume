import { useEffect } from 'react';
import { useAudio } from '../lib/stores/useAudio';

const AudioLoader = () => {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  
  useEffect(() => {
    // Create and preload audio elements
    try {
      // Background music (optional)
      const bgMusic = new Audio('/sounds/background.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
      bgMusic.preload = 'auto';
      setBackgroundMusic(bgMusic);
      
      // Hit sound (for interactions)
      const hitSfx = new Audio('/sounds/hit.mp3');
      hitSfx.preload = 'auto';
      setHitSound(hitSfx);
      
      // Success sound (for achievements)
      const successSfx = new Audio('/sounds/success.mp3');
      successSfx.preload = 'auto';
      setSuccessSound(successSfx);
      
      // Preload audio
      Promise.all([
        loadAudio(bgMusic),
        loadAudio(hitSfx),
        loadAudio(successSfx),
      ]).then(() => {
        console.log('Audio files preloaded successfully');
      }).catch(error => {
        console.warn('Some audio files could not be preloaded:', error);
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  return null; // This component doesn't render anything
};

// Helper function to preload audio
function loadAudio(audioElement: HTMLAudioElement) {
  return new Promise((resolve, reject) => {
    audioElement.addEventListener('canplaythrough', resolve, { once: true });
    audioElement.addEventListener('error', reject, { once: true });
    
    // Start loading
    if (audioElement.readyState < 4) { // HAVE_ENOUGH_DATA
      audioElement.load();
    } else {
      resolve(null);
    }
  });
}

export default AudioLoader;