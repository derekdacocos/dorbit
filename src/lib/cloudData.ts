import { useCountdownStore, type Countdown } from "@/stores/useCountdownStore";
import { useHabitStore, type Habit } from "@/stores/useHabitStore";
import { useLinksStore, type QuickLink } from "@/stores/useLinksStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNotesStore } from "@/stores/useNotesStore";
import { useSettingsStore, type City } from "@/stores/useSettingsStore";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";

export type DorbitData = {
  links: QuickLink[];
  todos: Todo[];
  notes: string;
  countdowns: Countdown[];
  habits: Habit[];
  musicLink: string;
  settings: {
    name: string;
    city: City;
    theme: "dark" | "light";
    wallpaper: string;
    order: string[];
    hidden: string[];
  };
};

export function getLocalData(): DorbitData {
  const settings = useSettingsStore.getState();
  return {
    links: useLinksStore.getState().links,
    todos: useTodoStore.getState().todos,
    notes: useNotesStore.getState().text,
    countdowns: useCountdownStore.getState().countdowns,
    habits: useHabitStore.getState().habits,
    musicLink: useMusicStore.getState().link,
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
  useSettingsStore.setState(data.settings);
}

export function subscribeToAllStores(onChange: () => void) {
  const stops = [
    useLinksStore.subscribe(onChange),
    useTodoStore.subscribe(onChange),
    useNotesStore.subscribe(onChange),
    useCountdownStore.subscribe(onChange),
    useHabitStore.subscribe(onChange),
    useMusicStore.subscribe(onChange),
    useSettingsStore.subscribe(onChange),
  ];
  return () => stops.forEach((stop) => stop());
}

export function toSortedJson(data: unknown) {
  return JSON.stringify(data, (_key, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
      : value
  );
}