import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorldClock = {
  id: string;
  name: string; // like "New York"
  place: string; // like "United States", shown smaller
  timeZone: string; // like "America/New_York"
};

type WorldClockState = {
  clocks: WorldClock[];
  addClock: (name: string, place: string, timeZone: string) => void;
  removeClock: (id: string) => void;
};

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set) => ({
      clocks: [],

      addClock: (name, place, timeZone) =>
        set((state) => ({
          clocks: [...state.clocks, { id: crypto.randomUUID(), name, place, timeZone }],
        })),

      removeClock: (id) =>
        set((state) => ({
          clocks: state.clocks.filter((clock) => clock.id !== id),
        })),
    }),
    { name: "dorbit-world-clocks" }
  )
);