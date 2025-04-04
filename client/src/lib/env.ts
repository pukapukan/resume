// Environment variables utility

// Check for keys available in the window object (for client-side access)
declare global {
  interface Window {
    ENV?: {
      // Add any environment variables needed here
    };
  }
}

// Export environment variables as needed