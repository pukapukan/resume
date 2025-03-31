export const SECTIONS = [
  "hero",
  "about",
  "experience",
  "projects",
  "contact",
];

export const THEME_COLORS = {
  dark: {
    background: "#0A192F",
    foreground: "#E6F1FF",
    primary: "#2D2D2D",
    secondary: "#64FFDA",
    highlight: "#FFB74D",
    card: "#112240",
    muted: "#8892B0",
    border: "#2D3952",
  },
  light: {
    background: "#F5F5F7",
    foreground: "#0A192F",
    primary: "#2D2D2D",
    secondary: "#0D7377",
    highlight: "#FF5722",
    card: "#FFFFFF",
    muted: "#637088",
    border: "#DADCE0",
  },
};

export const WORK_EXPERIENCE = [
  {
    company: "Stripe",
    position: "Senior Fullstack Software Engineer",
    location: "Remote (Irvine, CA)",
    duration: "6/2022 - 2/2025",
    description: [
      "Led fraud protection system scaling project, expanded supported payment methods by 50x",
      "Designed ML-based card verification app that reduced fraud by 30%",
      "Improved developer experience, reducing setup time from days to minutes",
    ],
    technologies: ["Java", "Ruby", "TypeScript", "React", "GraphQL", "Node.js"],
  },
  {
    company: "Amazon",
    position: "Senior Software Engineer",
    location: "Seattle/London",
    duration: "11/2016 - 6/2022",
    description: [
      "Optimized website latency, generating $30MM+ annual revenue gains",
      "Reduced API traffic by 60%, cutting hardware costs by $3M+ annually",
      "Led a team enhancing retail experience for non-Prime customers",
    ],
    technologies: ["JavaScript", "Java", "Memcached"],
  },
  {
    company: "Freelance",
    position: "Full Stack Developer",
    location: "Seoul (S.Korea)",
    duration: "3/2015 - 10/2016",
    description: [
      "Built API services and CMSs for multinational clients",
      "Developed educational JavaScript games for UK councils",
      "Created community platform with modern tech stack",
    ],
    technologies: ["Node.js", "React.js", "GraphQL", "Redis", "AWS"],
  },
];
