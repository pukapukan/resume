export const COLORS = {
  primary: "#2D2D2D", // deep grey
  secondary: "#64FFDA", // mint accent
  background: "#0A192F", // navy
  text: "#E6F1FF", // light blue-white
  highlight: "#FFB74D", // warm orange
  
  // Additional colors
  muted: "#8892B0",
  card: "#112240",
  border: "#2D3952",
};

export const getColorCssVariables = () => `
  :root {
    --background: 222 42% 11%;
    --foreground: 214 95% 95%;
    
    --primary: 0 0% 18%;
    --primary-foreground: 214 95% 95%;
    
    --secondary: 174 100% 70%;
    --secondary-foreground: 222 42% 11%;
    
    --muted: 217 19% 62%;
    --muted-foreground: 217 19% 62%;
    
    --accent: 36 100% 65%;
    --accent-foreground: 222 42% 11%;
    
    --card: 222 47% 16%;
    --card-foreground: 214 95% 95%;
    
    --popover: 222 47% 16%;
    --popover-foreground: 214 95% 95%;
    
    --border: 224 32% 25%;
    --input: 224 32% 25%;
    --ring: 174 100% 70%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    
    --radius: 0.5rem;
  }
`;
