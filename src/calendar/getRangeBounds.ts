import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import type { View } from "react-big-calendar";

export function getRangeBounds(date: Date, view: View) {
  if (view === "week") {
    return {
      from: startOfWeek(date, { weekStartsOn: 1 }),
      to: endOfWeek(date, { weekStartsOn: 1 }),
    };
  }
  if (view === "day") {
    return { from: startOfDay(date), to: endOfDay(date) };
  }
  // default: month
  return { from: startOfMonth(date), to: endOfMonth(date) };
}
