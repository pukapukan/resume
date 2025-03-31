import { create } from "zustand";

interface SectionState {
  activeSection: string;
  timeOfLastClick: number;
  setActiveSection: (section: string) => void;
  setTimeOfLastClick: (time: number) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  activeSection: "hero",
  timeOfLastClick: 0,
  setActiveSection: (section) => set({ activeSection: section }),
  setTimeOfLastClick: (time) => set({ timeOfLastClick: time }),
}));
