"use client";

import { useQuery } from "@tanstack/react-query";
import WidgetCard from "@/components/WidgetCard";
import { describeWeather, fetchWeather } from "@/lib/weather";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function WeatherWidget() {
  const city = useSettingsStore((state) => state.city);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weather", city.latitude, city.longitude],
    queryFn: () => fetchWeather(city.latitude, city.longitude),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

  if (isPending) {
    return (
      <WidgetCard title="Weather">
        <p className="text-sm text-slate-500">Loading weather...</p>
      </WidgetCard>
    );
  }

  if (isError) {
    return (
      <WidgetCard title="Weather">
        <p className="text-sm text-slate-400">Couldn&apos;t load the weather.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 self-start rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
        >
          Try again
        </button>
      </WidgetCard>
    );
  }

  const now = describeWeather(data.current.weather_code);
  const nextDays = data.daily.time.slice(1, 4).map((date, index) => ({
    day: new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "short" }),
    max: Math.round(data.daily.temperature_2m_max[index + 1]),
    icon: describeWeather(data.daily.weather_code[index + 1]).icon,
  }));

  return (
    <WidgetCard title="Weather">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{now.icon}</span>
        <div>
          <p className="text-5xl font-semibold">{Math.round(data.current.temperature_2m)}°</p>
          <p className="mt-1 text-sm text-slate-400">
            {now.label} · {city.name}
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
        {nextDays.map((d) => (
          <div key={d.day} className="rounded-xl bg-white/5 py-2 text-center">
            <p className="text-xs text-slate-400">{d.day}</p>
            <p className="text-sm">{d.icon}</p>
            <p className="font-semibold">{d.max}°</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}