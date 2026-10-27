"use client";

import { useState, type FormEvent } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useToday } from "@/hooks/useToday";
import { addDays, weekdayLabel } from "@/lib/dates";
import { useHabitStore } from "@/stores/useHabitStore";

// Counts how many days in a row you did the habit, going back from today.
// If today isn't ticked yet, the streak still counts from yesterday.
function getStreak(doneDates: string[], today: string): number {
  let day = doneDates.includes(today) ? today : addDays(today, -1);
  let streak = 0;
  while (doneDates.includes(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

export default function HabitWidget() {
  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const toggleDay = useHabitStore((state) => state.toggleDay);
  const removeHabit = useHabitStore((state) => state.removeHabit);

  const today = useToday();
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim() === "") return;
    addHabit(name.trim());
    setName("");
  }

  // The last 7 days, oldest first, ending with today
  const week = today === null ? [] : [6, 5, 4, 3, 2, 1, 0].map((n) => addDays(today, -n));

  return (
    <WidgetCard title="Habits">
      {today !== null && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-slate-500">
            {week.map((day) => (
              <span key={day}>{weekdayLabel(day).charAt(0)}</span>
            ))}
          </div>

          {habits.length === 0 && (
            <p className="text-sm text-slate-500">No habits yet. Add one below.</p>
          )}

          {habits.map((habit) => {
            const streak = getStreak(habit.doneDates, today);
            return (
              <div key={habit.id} className="group">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{habit.name}</span>
                  <span className="flex items-center gap-2 text-slate-400">
                    {streak} day streak
                    <button
                      type="button"
                      onClick={() => removeHabit(habit.id)}
                      className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {week.map((day) => {
                    const done = habit.doneDates.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(habit.id, day)}
                        title={day}
                        className={
                          done
                            ? "h-7 rounded-md bg-violet-400 hover:bg-violet-300"
                            : "h-7 rounded-md bg-white/10 hover:bg-white/20"
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New habit (e.g. Drink water)"
          className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-400 px-3 text-lg font-medium text-slate-950 hover:bg-violet-300"
        >
          +
        </button>
      </form>
    </WidgetCard>
  );
}