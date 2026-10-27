import Clock from "@/components/Clock";
import QuickLinks from "@/components/QuickLinks";
import SearchBar from "@/components/SearchBar";
import TodoWidget from "@/components/TodoWidget";
import WeatherWidget from "@/components/WeatherWidget";
import FocusWidget from "@/components/FocusWidget";
import MusicWidget from "@/components/MusicWidget";
import NotesWidget from "@/components/NotesWidget";
import CountdownWidget from "@/components/CountdownWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
        <Clock name="Derek" />
        <SearchBar />
        <QuickLinks />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WeatherWidget />
          <FocusWidget />
          <MusicWidget />
          <TodoWidget />
          <NotesWidget />
          <CountdownWidget />
        </div>
      </div>
    </main>
  );
}