import CountdownWidget from "@/components/CountdownWidget";
import FocusWidget from "@/components/FocusWidget";
import HabitWidget from "@/components/HabitWidget";
import MusicWidget from "@/components/MusicWidget";
import NotesWidget from "@/components/NotesWidget";
import TodoWidget from "@/components/TodoWidget";
import WeatherWidget from "@/components/WeatherWidget";

// Every widget on the dashboard, in the default order
export const WIDGETS = [
  { id: "weather", name: "Weather", Component: WeatherWidget },
  { id: "focus", name: "Focus", Component: FocusWidget },
  { id: "music", name: "Music", Component: MusicWidget },
  { id: "todo", name: "To-do", Component: TodoWidget },
  { id: "notes", name: "Notes", Component: NotesWidget },
  { id: "countdowns", name: "Countdowns", Component: CountdownWidget },
  { id: "habits", name: "Habits", Component: HabitWidget },
];