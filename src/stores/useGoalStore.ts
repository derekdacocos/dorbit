import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Goal = {
  text: string;
  date: string; // "YYYY-MM-DD": the day you set it. A goal from another day counts as no goal.
  done: boolean;
};

type GoalState = {
  goal: Goal | null;
  setGoal: (text: string, date: string) => void;
  toggleDone: () => void;
  clearGoal: () => void;
};

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goal: null,

      setGoal: (text, date) => set({ goal: { text, date, done: false } }),

      toggleDone: () =>
        set((state) => (state.goal ? { goal: { ...state.goal, done: !state.goal.done } } : {})),

      clearGoal: () => set({ goal: null }),
    }),
    { name: "dorbit-goal" }
  )
);