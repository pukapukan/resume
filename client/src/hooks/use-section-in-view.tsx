import { useState, useEffect } from "react";
import { InView } from "react-intersection-observer";
import { useSectionStore } from "@/lib/stores/useSectionStore";

export function useSectionInView(sectionName: string, threshold = 0.75) {
  const { setActiveSection, timeOfLastClick } = useSectionStore();
  const [ref, inView] = InView({
    threshold,
  });

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return {
    ref,
    inView,
  };
}
