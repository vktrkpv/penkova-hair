// src/pages/admin/CalendarToolbar.tsx  (або твій шлях)
import { ReactNode } from "react";
import { format } from "date-fns";
import { Views, View } from "react-big-calendar";

type Props = {
  date: Date;
  view: View;
  onView: (v: View) => void;
  onNavigate: (action: "TODAY" | "PREV" | "NEXT") => void;
  /** Правий слот: тут ми рендеримо AddAppointmentController з кнопкою */
  rightSlot?: ReactNode;
};

export default function CalendarToolbar({
  date,
  view,
  onView,
  onNavigate,
  rightSlot,
}: Props) {
  const SegBtn = (v: View, label: string) => (
    <button
      onClick={() => onView(v)}
      className={`px-3 py-1.5 text-xs rounded-full w-full sm:w-auto ${
        view === v ? "bg-[var(--brand-surface)]" : "hover:bg-[var(--brand-surface)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-2">
      {/* Заголовок */}
      <div className="mb-3">
        <h2 className="text-lg sm:text-xl font-semibold leading-tight">Calendar</h2>
        <div className="text-sm opacity-70">{format(date, "dd MMM yyyy")}</div>
      </div>

      {/* Блок керування: мобільно — в стовпчик; з sm — в ряд */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Ліва частина: навігація + переключення вигляду */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* Ряд 1: Prev / Today / Next */}
          <div className="inline-flex w-full sm:w-auto rounded-xl border border-[var(--brand-border)] bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => onNavigate("PREV")}
              className="px-3 py-1.5 text-sm hover:bg-[var(--brand-surface)] rounded-l-xl w-full sm:w-auto"
            >
              ← Prev
            </button>
            <button
              onClick={() => onNavigate("TODAY")}
              className="px-3 py-1.5 text-sm border-x border-[var(--brand-border)] hover:bg-[var(--brand-surface)] w-full sm:w-auto"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate("NEXT")}
              className="px-3 py-1.5 text-sm hover:bg-[var(--brand-surface)] rounded-r-xl w-full sm:w-auto"
            >
              Next →
            </button>
          </div>

          {/* Ряд 2: Month / Week / Day */}
          <div className="inline-flex w-full sm:w-auto rounded-full border border-[var(--brand-border)] p-0.5">
            {SegBtn(Views.MONTH, "Month")}
            {SegBtn(Views.WEEK, "Week")}
            {SegBtn(Views.DAY, "Day")}
          </div>
        </div>

        {/* Ряд 3: Add Appointment (rightSlot) — на мобільному стає повною шириною */}
        {rightSlot && (
          <div className="w-full sm:w-auto">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
