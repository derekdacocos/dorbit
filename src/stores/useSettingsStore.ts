import { create } from "zustand";
import { persist } from "zustand/middleware";
 
type Theme = "dark" | "light";
 
export type City = {
  name: string;
  latitude: number;
  longitude: number;
};
 
type SettingsState = {
  name: string;
  city: City;
  theme: Theme;
  wallpaper: string;
  order: string[]; // widget ids in the order you arranged them (empty = default order)
  hidden: string[];
  isCustomizing: boolean;
  setName: (name: string) => void;
  setCity: (city: City) => void;
  toggleTheme: () => void;
  setWallpaper: (url: string) => void;
  setOrder: (order: string[]) => void;
  toggleHidden: (id: string) => void;
  toggleCustomizing: () => void;
};
 
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      name: "",
      city: { name: "Baguio", latitude: 16.4023, longitude: 120.596 },
      theme: "dark",
      wallpaper: "",
      order: [],
      hidden: [],
      isCustomizing: false,
 
      setName: (name) => set({ name }),
 
      setCity: (city) => set({ city }),
 
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
 
      setWallpaper: (url) => set({ wallpaper: url }),
 
      setOrder: (order) => set({ order }),
 
      toggleHidden: (id) =>
        set((state) => ({
          hidden: state.hidden.includes(id)
            ? state.hidden.filter((h) => h !== id)
            : [...state.hidden, id],
        })),
 
      toggleCustomizing: () => set((state) => ({ isCustomizing: !state.isCustomizing })),
    }),
    {
      name: "dorbit-settings",
      // Save everything except isCustomizing (that should reset on refresh)
      partialize: (state) => ({
        name: state.name,
        city: state.city,
        theme: state.theme,
        wallpaper: state.wallpaper,
        order: state.order,
        hidden: state.hidden,
      }),
    }
  )
);
 