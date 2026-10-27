"use client";

import { useEffect, useState } from "react";

type ClockProps = {
  name: string;
};

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Clock({ name }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (now === null) {
    return <div className="h-56" />;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, "0");

  const dateText = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="flex flex-col items-center text-center">
      <p className="text-xl text-slate-300">
        {getGreeting(hours)}, <span className="font-semibold text-white">{name}</span>
      </p>

      <p className="mt-2 flex items-baseline gap-3 font-semibold tabular-nums">
        <span className="text-8xl tracking-tight sm:text-9xl">
          {displayHour}:{displayMinutes}
        </span>
        <span className="text-4xl text-slate-400">{period}</span>
      </p>

      <p className="mt-4 text-lg text-slate-400">
        {dateText} · Welcome back to Dorbit
      </p>
    </section>
  );
}