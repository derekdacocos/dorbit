import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Countdown = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
};

type CountdownState = {
  countdowns: Countdown[];
  addCountdown: (title: string, date: string) => void;
  removeCountdown: (id: string) => void;
};

export const useCountdownStore = create<CountdownState>()(
  persist(
    (set) => ({
      countdowns: [],

      addCountdown: (title, date) =>
        set((state) => ({
          countdowns: [...state.countdowns, { id: crypto.randomUUID(), title, date }],
        })),

      removeCountdown: (id) =>
        set((state) => ({
          countdowns: state.countdowns.filter((c) => c.id !== id),
        })),
    }),
    { name: "dorbit-countdowns" }
  )
);