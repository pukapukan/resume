// Environment variables utility

// This empty export makes the file a module
export {};

// Then we can augment the global scope
declare global {
  interface Window {
    ENV?: Record<string, string>;
  }
}