import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

type SettingsState = {
  theme: Theme;
  wallpaper: string;
  order: string[]; // widget ids in the order you arranged them (empty = default order)
  hidden: string[];
  isCustomizing: boolean;
  toggleTheme: () => void;
  setWallpaper: (url: string) => void;
  setOrder: (order: string[]) => void;
  toggleHidden: (id: string) => void;
  toggleCustomizing: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      wallpaper: "",
      order: [],
      hidden: [],
      isCustomizing: false,

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
        theme: state.theme,
        wallpaper: state.wallpaper,
        order: state.order,
        hidden: state.hidden,
      }),
    }
  )
);