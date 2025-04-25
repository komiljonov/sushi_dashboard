import { create } from "zustand";

interface DateFilterState {
  start: string;
  end: string;
  setDateFilter: (start: string, end: string) => void;
  resetDateFilters: () => void;
}

// 🔹 Zustand store for dates
export const useDateFilterStore = create<DateFilterState>((set) => ({
  start: "",
  end: "",

  setDateFilter: (start, end) =>
    set(() => ({
      start,
      end,
    })),

  resetDateFilters: () =>
    set({
      start: "",
      end: "",
    }),
}));
