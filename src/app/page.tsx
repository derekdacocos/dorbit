import Clock from "@/components/Clock";
import QuickLinks from "@/components/QuickLinks";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 pt-24">
        <Clock name="Derek" />
        <QuickLinks />
      </div>
    </main>
  );
}