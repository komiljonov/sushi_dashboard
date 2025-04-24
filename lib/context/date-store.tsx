import { create } from "zustand";

interface DateFilterState {
  start_date: string;
  end_date: string;
  setDateFilter: (start_date: string, end_date: string) => void;
  resetDateFilters: () => void;
}

// 🔹 Zustand store for dates
export const useDateFilterStore = create<DateFilterState>((set) => ({
  start_date: "",
  end_date: "",

  setDateFilter: (start_date, end_date) =>
    set(() => ({
      start_date,
      end_date,
    })),

  resetDateFilters: () =>
    set({
      start_date: "",
      end_date: "",
    }),
}));
