import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Reminder = {
  id: string;
  label: string; // like "Shift starts" or "Drink water"
  time: string; // "HH:MM" in 24-hour time, like "09:00"
  days: number[]; // days it rings: 0 = Sunday ... 6 = Saturday. Empty = rings once.
  on: boolean;
  lastRang: string; // "YYYY-MM-DD" of the last day it rang, so it rings once a day
};

type ReminderState = {
  reminders: Reminder[];
  addReminder: (label: string, time: string, days: number[]) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  markRang: (id: string, date: string) => void;
};

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      reminders: [],

      addReminder: (label, time, days) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            { id: crypto.randomUUID(), label, time, days, on: true, lastRang: "" },
          ],
        })),

      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, on: !r.on } : r)),
        })),

      removeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),

      // A one-time reminder (no days picked) turns itself off after it rings
      markRang: (id, date) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, lastRang: date, on: r.days.length > 0 ? r.on : false } : r
          ),
        })),
    }),
    { name: "dorbit-reminders" }
  )
);