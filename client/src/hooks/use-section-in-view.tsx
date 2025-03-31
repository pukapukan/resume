import { useEffect } from "react";
import { useCustomInView } from "./useCustomInView";
import { useSectionStore } from "../lib/stores/useSectionStore";

export function useSectionInView(sectionName: string, threshold = 0.75) {
  const { setActiveSection } = useSectionStore();
  // Use our custom hook with respectClickState=true to respect navigation clicks
  const { ref, inView } = useCustomInView({
    threshold,
    respectClickState: true
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(sectionName);
    }
  }, [inView, setActiveSection, sectionName]);

  return {
    ref,
    inView,
  };
}
