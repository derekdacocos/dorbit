import { useCountdownStore, type Countdown } from "@/stores/useCountdownStore";
import { useGoalStore, type Goal } from "@/stores/useGoalStore";
import { useHabitStore, type Habit } from "@/stores/useHabitStore";
import { useLinksStore, type QuickLink } from "@/stores/useLinksStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNotesStore } from "@/stores/useNotesStore";
import { useReminderStore, type Reminder } from "@/stores/useReminderStore";
import { useSettingsStore, type City } from "@/stores/useSettingsStore";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";
import { useWorldClockStore, type WorldClock } from "@/stores/useWorldClockStore";

// Everything Dorbit saves, in one object. This is what goes into your cloud document.
export type DorbitData = {
  links: QuickLink[];
  todos: Todo[];
  notes: string;
  countdowns: Countdown[];
  habits: Habit[];
  musicLink: string;
  goal?: Goal | null; // "?" = may be missing in documents saved before this step
  worldClocks?: WorldClock[];
  reminders?: Reminder[];
  settings: {
    name: string;
    city: City;
    theme: "dark" | "light";
    wallpaper: string;
    order: string[];
    hidden: string[];
  };
};

// Collects the data from every store on this device
export function getLocalData(): DorbitData {
  const settings = useSettingsStore.getState();
  return {
    links: useLinksStore.getState().links,
    todos: useTodoStore.getState().todos,
    notes: useNotesStore.getState().text,
    countdowns: useCountdownStore.getState().countdowns,
    habits: useHabitStore.getState().habits,
    musicLink: useMusicStore.getState().link,
    goal: useGoalStore.getState().goal,
    worldClocks: useWorldClockStore.getState().clocks,
    reminders: useReminderStore.getState().reminders,
    settings: {
      name: settings.name,
      city: settings.city,
      theme: settings.theme,
      wallpaper: settings.wallpaper,
      order: settings.order,
      hidden: settings.hidden,
    },
  };
}

// Puts data from the cloud into every store (persist then saves it on this device too)
export function applyCloudData(data: DorbitData) {
  useLinksStore.setState({ links: data.links });
  useTodoStore.setState({ todos: data.todos });
  if (data.notes !== useNotesStore.getState().text) {
    useNotesStore.setState((state) => ({
      text: data.notes,
      cloudVersion: state.cloudVersion + 1,
    }));
  }
  useCountdownStore.setState({ countdowns: data.countdowns });
  useHabitStore.setState({ habits: data.habits });
  useMusicStore.setState({ link: data.musicLink });
  useGoalStore.setState({ goal: data.goal ?? null });
  useWorldClockStore.setState({ clocks: data.worldClocks ?? [] });
  useReminderStore.setState({ reminders: data.reminders ?? [] });
  useSettingsStore.setState(data.settings);
}

// Calls onChange whenever any store changes. Returns a function that stops listening.
export function subscribeToAllStores(onChange: () => void) {
  const stops = [
    useLinksStore.subscribe(onChange),
    useTodoStore.subscribe(onChange),
    useNotesStore.subscribe(onChange),
    useCountdownStore.subscribe(onChange),
    useHabitStore.subscribe(onChange),
    useMusicStore.subscribe(onChange),
    useGoalStore.subscribe(onChange),
    useWorldClockStore.subscribe(onChange),
    useReminderStore.subscribe(onChange),
    useSettingsStore.subscribe(onChange),
  ];
  return () => stops.forEach((stop) => stop());
}

// Turns data into text with the keys always in A-Z order. Firestore can give keys back in a
// different order than we sent them, so this lets us tell "same data" from "new data".
export function toSortedJson(data: unknown) {
  return JSON.stringify(data, (_key, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
      : value
  );
}