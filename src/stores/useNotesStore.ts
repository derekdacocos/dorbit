import { create } from "zustand";
import { persist } from "zustand/middleware";

type NotesState = {
  text: string;
  cloudVersion: number;
  saveText: (text: string) => void;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      text: "",
      cloudVersion: 0,
      saveText: (text) => set({ text }),
    }),
    { name: "dorbit-notes" }
  )
);