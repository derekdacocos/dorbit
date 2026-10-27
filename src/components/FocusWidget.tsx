"use client";

import { useEffect, useState } from "react";
import WidgetCard from "@/components/WidgetCard";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

type Mode = "focus" | "break";

function playBeep() {
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.frequency.value = 880;
  oscillator.connect(volume);
  volume.connect(audio.destination);
  volume.gain.setValueAtTime(0.2, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1.2);
  oscillator.start();
  oscillator.stop(audio.currentTime + 1.2);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusWidget() {
  const [mode, setMode] = useState<Mode>("focus");
  const [round, setRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!isRunning || endAt === null) return;

    const intervalId = setInterval(() => {
      const current = Date.now();

      if (current >= endAt) {
        clearInterval(intervalId);
        playBeep();
        const nextMode: Mode = mode === "focus" ? "break" : "focus";
        if (mode === "break") setRound((r) => r + 1);
        setMode(nextMode);
        setIsRunning(false);
        setEndAt(null);
        setRemaining(nextMode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
      } else {
        setNow(current);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [isRunning, endAt, mode]);

  const totalSeconds = mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  const secondsLeft =
    isRunning && endAt !== null
      ? Math.max(0, Math.ceil((endAt - now) / 1000))
      : remaining;
  const progress = 1 - secondsLeft / totalSeconds;

  function start() {
    const current = Date.now();
    setNow(current);
    setEndAt(current + remaining * 1000);
    setIsRunning(true);
  }

  function pause() {
    setRemaining(secondsLeft);
    setIsRunning(false);
    setEndAt(null);
  }

  function reset() {
    setIsRunning(false);
    setEndAt(null);
    setRemaining(totalSeconds);
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <WidgetCard title="Focus">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" strokeWidth="8" className="stroke-white/10" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className={mode === "focus" ? "stroke-violet-400" : "stroke-emerald-400"}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-semibold tabular-nums">{formatTime(secondsLeft)}</p>
          <p className="mt-1 text-xs text-slate-400">
            {mode === "focus" ? "Focus" : "Break"} · Round {round}
          </p>
        </div>
      </div>

      <div className="mt-auto flex justify-center gap-2 pt-6">
        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="rounded-xl bg-violet-400 px-6 py-2 font-medium text-slate-950 hover:bg-violet-300"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-white/10 px-4 py-2 text-slate-200 hover:bg-white/20"
        >
          Reset
        </button>
      </div>
    </WidgetCard>
  );
}