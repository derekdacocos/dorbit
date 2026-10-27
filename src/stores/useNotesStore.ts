import { create } from "zustand";
import { persist } from "zustand/middleware";

type NotesState = {
  text: string;
  saveText: (text: string) => void;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      text: "",
      saveText: (text) => set({ text }),
    }),
    { name: "dorbit-notes" }
  )
);