import { create } from "zustand";
import { persist } from "zustand/middleware";

type MusicState = {
  link: string;
  setLink: (link: string) => void;
};

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      link: "https://youtu.be/n61ULEU7CO0?si=uno59jW-D8g7U__i",
      setLink: (link) => set({ link }),
    }),
    { name: "dorbit-music" }
  )
);