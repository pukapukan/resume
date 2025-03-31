import { useEffect } from "react";
import { useSectionStore } from "../lib/stores/useSectionStore";

export const useActiveSection = (sectionId: string, threshold = 0.5) => {
  const { setActiveSection } = useSectionStore();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(sectionId);
        }
      },
      {
        rootMargin: "0px",
        threshold,
      }
    );

    const element = document.getElementById(sectionId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [sectionId, setActiveSection, threshold]);
};
