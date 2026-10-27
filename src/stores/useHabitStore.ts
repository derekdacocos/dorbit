import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Habit = {
  id: string;
  name: string;
  doneDates: string[]; // list of "YYYY-MM-DD" days you did it
};

type HabitState = {
  habits: Habit[];
  addHabit: (name: string) => void;
  toggleDay: (id: string, dateKey: string) => void;
  removeHabit: (id: string) => void;
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (name) =>
        set((state) => ({
          habits: [...state.habits, { id: crypto.randomUUID(), name, doneDates: [] }],
        })),

      toggleDay: (id, dateKey) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            const isDone = habit.doneDates.includes(dateKey);
            return {
              ...habit,
              doneDates: isDone
                ? habit.doneDates.filter((d) => d !== dateKey)
                : [...habit.doneDates, dateKey],
            };
          }),
        })),

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
    }),
    { name: "dorbit-habits" }
  )
);