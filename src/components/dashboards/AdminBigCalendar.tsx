// src/pages/admin/AdminBigCalendar.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Views, View } from "react-big-calendar";
import { localizer } from "../../calendar/localizer";
import { getRangeBounds } from "../../calendar/getRangeBounds";
import { useAuth } from "../../auth/AuthProvider";
import { listenAppointmentsRange, timeUtils } from "../../services/appointments";

import CalendarToolbar from "./CalendarToolbar";
import AddAppointmentController from "./AddAppointmentController";
import EventChip from "./EventChip";
import AppointmentModal from "./AppointmentModal";

// ⬇️ важливо: шлях до твоєї модалки
import AddAppointmentModal from "../../components/dashboards/AddAppointmentModal";

import type { AppointmentDraft, ServiceItem } from "../../types/appointments";

export type CalItem = {
  id: string;
  start: number;
  end: number;
  clientName?: string;
  serviceName?: string;
  price?: number | null;
  status?: "booked" | "confirmed" | "paid" | "canceled";

  // бажано, щоб слухач додавав ці поля у resource
  client?: { id?: string; name: string; phone?: string; email?: string };
  services?: ServiceItem[];
  stylistUid?: string;
  durationMin?: number;
  date?: string; // "YYYY-MM-DD"
};

function mapToEvents(items: CalItem[]) {
  return items.map((i) => {
    const start = new Date(i.start);
    const end = new Date(i.end);
    const svc = (i as any).serviceName || (i as any).servicesText || "";
    const price = i.price != null ? ` · $${i.price}` : "";
    return {
      id: i.id,
      title: (i.clientName || "Client") + (svc ? ` · ${svc}` : "") + price,
      start,
      end,
      resource: { ...i, serviceName: svc },
    };
  });
}

function hhmmFromMs(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AdminBigCalendar() {
  const { user } = useAuth();
  const ownerUid = (user as any)?.uid || null;

  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.WEEK);
  const [items, setItems] = useState<CalItem[]>([]);
  const [err, setErr] = useState("");

  // 1) Перегляд події (клік по івенту)
  const [opened, setOpened] = useState<CalItem | null>(null);

  // 2) Редагування сервісів у великій модалці
  const [editing, setEditing] = useState<null | {
    apptId: string;
    initialDraft: AppointmentDraft;
    ownerUid: string;
  }>(null);

  const { from, to } = useMemo(() => getRangeBounds(date, view), [date, view]);

  useEffect(() => {
    if (!ownerUid) return;
    const unsub = listenAppointmentsRange(
      ownerUid,
      from.getTime(),
      to.getTime(),
      (list: CalItem[]) => setItems(list),
      (e: any) => {
        console.warn("[Calendar]", e.code, e.message);
        setErr(e.code === "failed-precondition" ? "Firestore index is building…" : "");
      }
    );
    return () => unsub && unsub();
  }, [ownerUid, from, to]);

  const events = useMemo(() => mapToEvents(items), [items]);

  const handleRangeChange = useCallback((range: any) => {
    if (Array.isArray(range)) {
      const min = range.reduce((a, b) => (a < b ? a : b));
      setDate(min);
      return;
    }
    setDate(range.start);
  }, []);

  const onSelectEvent = useCallback((e: any) => {
    setOpened(e.resource as CalItem);
  }, []);

  const eventPropGetter = useCallback(() => ({ style: {} }), []);

  const formats = {
    timeGutterFormat: "h:mm a",
    eventTimeRangeFormat: ({ start, end }: any) =>
      `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    dayRangeHeaderFormat: ({ start, end }: any) =>
      `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`,
  };

  return (
    <div className="space-y-3">
      <CalendarToolbar
        date={date}
        view={view}
        onView={(v) => setView(v)}
        onNavigate={(action) => {
          if (action === "TODAY") return setDate(new Date());
          const delta = view === "day" ? 1 : view === "week" ? 7 : 30;
          setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + (action === "NEXT" ? delta : -delta)));
        }}
        rightSlot={<AddAppointmentController />}
      />

      {err && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          {err}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-2 shadow-soft">
        <Calendar
          localizer={localizer as any}
          events={events}
          date={date}
          view={view}
          onView={(v) => setView(v)}
          onNavigate={(d) => setDate(d)}
          onRangeChange={handleRangeChange}
          startAccessor="start"
          endAccessor="end"
          formats={formats}
          popup
          popupOffset={8}
          showMultiDayTimes
          style={{ height: "72vh", background: "white", borderRadius: 14, padding: 6 }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={onSelectEvent}
          min={new Date(1970, 0, 1, 9, 0)}
          max={new Date(1970, 0, 1, 20, 0)}
          step={30}
          timeslots={2}
          components={{ event: EventChip }}
        />
      </div>

      {/* ① Перегляд і дії по апоінтменту */}
      {opened && (
        <AppointmentModal
          item={opened as any}
          onClose={() => setOpened(null)}
          onEditServices={(appt: any) => {
            // будую початковий драфт для модалки редагування
            const dateISO = appt.date ?? new Date(appt.start).toISOString().slice(0, 10);
            const startHHMM =
              timeUtils?.toHHMM?.(appt.start) ?? hhmmFromMs(appt.start);

            const initialDraft: AppointmentDraft = {
              services: appt.services || [],
              client: appt.client || (appt.clientName ? { name: appt.clientName } : null),
              date: dateISO ? new Date(dateISO) : new Date(appt.start),
              start: startHHMM,
            };

            setEditing({
              apptId: appt.id,
              initialDraft,
              ownerUid: ownerUid!,
            });
            setOpened(null);
          }}
        />
      )}

      {/* ② Величезна модалка в режимі редагування сервісів */}
      {editing && (
        <AddAppointmentModal
          mode="edit"
          ownerUid={editing.ownerUid}
          initialDraft={editing.initialDraft}
          apptId={editing.apptId}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
