"use client";

import { useToday } from "@/hooks/useToday";
import { daysBetween } from "@/lib/dates";
import { QUOTES } from "@/lib/quotes";

// A different quote every day (everyone sees the same one on the same day)
export default function DailyQuote() {
  const today = useToday();
  if (today === null) return null;

  const dayNumber = daysBetween("2026-01-01", today);
  const quote = QUOTES[((dayNumber % QUOTES.length) + QUOTES.length) % QUOTES.length];

  return (
    <figure className="mx-auto mt-10 max-w-xl text-center">
      <blockquote className="text-base text-slate-300 italic">“{quote.text}”</blockquote>
      <figcaption className="mt-1 text-xs text-slate-500">— {quote.author}</figcaption>
    </figure>
  );
}