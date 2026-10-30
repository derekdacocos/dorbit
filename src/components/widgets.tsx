import CountdownWidget from "@/components/CountdownWidget";
import FocusWidget from "@/components/FocusWidget";
import HabitWidget from "@/components/HabitWidget";
import MusicWidget from "@/components/MusicWidget";
import NotesWidget from "@/components/NotesWidget";
import ReminderWidget from "@/components/ReminderWidget";
import TodoWidget from "@/components/TodoWidget";
import WeatherWidget from "@/components/WeatherWidget";
import WorldClockWidget from "@/components/WorldClockWidget";

export const WIDGETS = [
  { id: "weather", name: "Weather", icon: "⛅", description: "Today's weather for your city", Component: WeatherWidget },
  { id: "focus", name: "Focus", icon: "⏱️", description: "A focus timer with breaks", Component: FocusWidget },
  { id: "music", name: "Music", icon: "🎵", description: "Play a YouTube or Spotify link", Component: MusicWidget },
  { id: "todo", name: "To-do", icon: "✅", description: "A simple task list", Component: TodoWidget },
  { id: "notes", name: "Notes", icon: "📝", description: "Quick notes that save by themselves", Component: NotesWidget },
  { id: "countdowns", name: "Countdowns", icon: "📅", description: "Days left until your events", Component: CountdownWidget },
  { id: "habits", name: "Habits", icon: "🔥", description: "Track daily habits and streaks", Component: HabitWidget },
  { id: "reminders", name: "Reminders", icon: "🔔", description: "A chime at the times you choose", Component: ReminderWidget },
  { id: "worldclocks", name: "World clocks", icon: "🌍", description: "The time in other cities", Component: WorldClockWidget },
];