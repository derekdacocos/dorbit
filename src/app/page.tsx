import Backdrop from "@/components/Backdrop";
import Clock from "@/components/Clock";
import CloudSync from "@/components/CloudSync";
import DailyQuote from "@/components/DailyQuote";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import QuickLinks from "@/components/QuickLinks";
import SearchBar from "@/components/SearchBar";
import TodayGoal from "@/components/TodayGoal";
import Welcome from "@/components/Welcome";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Backdrop />
      <CloudSync />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-16">
        <Header />
        <div className="pt-16">
          <Clock />
          <TodayGoal />
        </div>
        <SearchBar />
        <QuickLinks />
        <Dashboard />
        <DailyQuote />
      </div>
      <Welcome />
    </main>
  );
}