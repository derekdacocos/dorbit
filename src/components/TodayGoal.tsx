"use client";

import { useState, type SubmitEvent } from "react";
import { useToday } from "@/hooks/useToday";
import { useGoalStore } from "@/stores/useGoalStore";

// "What's your main focus today?" under the clock. Resets by itself every new day.
export default function TodayGoal() {
  const goal = useGoalStore((state) => state.goal);
  const setGoal = useGoalStore((state) => state.setGoal);
  const toggleDone = useGoalStore((state) => state.toggleDone);
  const clearGoal = useGoalStore((state) => state.clearGoal);

  const today = useToday();
  const [text, setText] = useState("");

  if (today === null) return <div className="h-16" />; // same height while loading

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim() === "" || today === null) return;
    setGoal(text.trim(), today);
    setText("");
  }

  // A goal from yesterday doesn't count
  const todaysGoal = goal && goal.date === today ? goal : null;

  if (!todaysGoal) {
    return (
      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex h-16 max-w-md flex-col items-center">
        <label htmlFor="today-goal" className="text-sm text-slate-400">
          What&apos;s your main focus today?
        </label>
        <input
          id="today-goal"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type it and press Enter"
          className="mt-1 w-full border-b border-white/20 bg-transparent py-1 text-center text-lg outline-none placeholder:text-slate-600 focus:border-violet-400"
        />
      </form>
    );
  }

  return (
    <div className="group mx-auto mt-6 flex h-16 max-w-md flex-col items-center">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Today</p>
      <div className="pop-in mt-1 flex items-center gap-3">
        <input
          type="checkbox"
          checked={todaysGoal.done}
          onChange={toggleDone}
          className="h-5 w-5 accent-violet-400"
          aria-label="Mark as done"
        />
        <span className={todaysGoal.done ? "text-lg text-slate-500 line-through" : "text-lg"}>
          {todaysGoal.text}
        </span>
        {todaysGoal.done && <span className="pop-in">🎉</span>}
        <button
          type="button"
          onClick={clearGoal}
          className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
          aria-label="Remove focus"
        >
          ✕
        </button>
      </div>
    </div>
  );
}