// Environment variables utility

// Check for keys available in the window object (for client-side access)
declare global {
  interface Window {
    ENV?: {
      MAPBOX_ACCESS_TOKEN?: string;
    };
  }
}

// Mapbox access token - we'll get this from the server
export const MAPBOX_ACCESS_TOKEN = window.ENV?.MAPBOX_ACCESS_TOKEN || '';