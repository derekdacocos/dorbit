import Backdrop from "@/components/Backdrop";
import Clock from "@/components/Clock";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import QuickLinks from "@/components/QuickLinks";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Backdrop />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-16">
        <Header />
        <div className="pt-16">
          <Clock name="Derek" />
        </div>
        <SearchBar />
        <QuickLinks />
        <Dashboard />
      </div>
    </main>
  );
}