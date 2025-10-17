// src/pages/admin/AdminBigCalendar.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import { localizer } from "../../calendar/localizer";
import { getRangeBounds } from "../../calendar/getRangeBounds";
import { useAuth } from "../../auth/AuthProvider";
import { listenAppointmentsRange, timeUtils } from "../../services/appointments";

import CalendarToolbar from "./CalendarToolbar";
import AddAppointmentController from "./AddAppointmentController";
import EventChip from "./EventChip";
import AppointmentModal from "./AppointmentModal";
import AddAppointmentModal from "../../components/dashboards/AddAppointmentModal";

import type { AppointmentDraft, ServiceItem } from "../../types/appointments";
import { getOwnerUid } from "../../lib/ownerUid";

import { listenBlocksRange } from "../../services/blocks";
import AddBlockModal from "./calendarBlock/AddBlockModal";

/* ───────────────────────── Types ───────────────────────── */
export type CalItem = {
  id: string;
  start: number;
  end: number;
  clientName?: string;
  serviceName?: string;
  price?: number | null;
  status?: "booked" | "confirmed" | "paid" | "canceled";
  client?: { id?: string; name: string; phone?: string; email?: string };
  services?: ServiceItem[];
  stylistUid?: string;
  durationMin?: number;
  date?: string; // "YYYY-MM-DD"
};

type RbcView = "month" | "week" | "work_week" | "day" | "agenda";

/* ─────────────────────── Helpers ─────────────────────── */
function mapToEvents(items: CalItem[]) {
  const out: any[] = [];

  for (const i of items) {
    const start = new Date(i.start);
    const end = new Date(i.end);

    // ⬇️ СКИДАЄМО ВСІ full-day-like апойнтменти
    if (isFullDayRange(start, end)) continue;

    const name =
      (i as any).clientName ||
      (i as any).client?.name ||
      [ (i as any).client?.firstName, (i as any).client?.lastName ]
        .filter(Boolean)
        .join(" ") ||
      "Client";

    const servicesText =
      (i as any).serviceName ||
      (Array.isArray((i as any).serviceNames) && (i as any).serviceNames.length
        ? (i as any).serviceNames.join(" + ")
        : Array.isArray((i as any).services) && (i as any).services.length
        ? (i as any).services.map((s: any) => s?.name).filter(Boolean).join(" + ")
        : "");

    const priceNum =
      (i as any).priceTotal ??
      (i as any).price ??
      (Array.isArray((i as any).services)
        ? (i as any).services.reduce((sum: number, s: any) => sum + (Number(s?.price) || 0), 0)
        : undefined);
    const price = priceNum != null ? ` · $${priceNum}` : "";

    out.push({
      id: (i as any).id,
      start,
      end,
      title: servicesText ? `${name} — ${servicesText}${price}` : `${name}${price}`,
      resource: {
        ...i,
        id: (i as any).id,
        clientName: name,
        serviceName: servicesText,
        priceTotal: priceNum,
        price: priceNum,
        start,
        end,
      },
    });
  }

  return out;
}


// ⬇️ НОВЕ: маппер для background-events (тільки фон)
function mapBlocksToBackground(rows: any[]) {
  return rows.map((b) => ({
    id: `block-bg:${b.id}`,
    title: b.reason ? `Blocked — ${b.reason}` : "Blocked",
    start: new Date(b.start),
    end: new Date(b.end),
    resource: { ...b, isBlock: true },
  }));
}

function hhmmFromMs(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isSameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function isFullDayRange(start: Date, end: Date) {
  // 00:00 → 23:59/59:59 того ж дня, або тривалість ≥ 23 год
  const durH = (end.getTime() - start.getTime()) / 3600000;
  const fullDayHours = durH >= 23;
  const startMidnight = start.getHours() === 0 && start.getMinutes() === 0;
  const endAlmostMidnight = end.getHours() === 23 && end.getMinutes() >= 55;
  return fullDayHours || (isSameYMD(start, end) && startMidnight && endAlmostMidnight);
}
function overlapsBlock(evStart: Date, evEnd: Date, blocks: any[]) {
  return blocks.some(b => evStart < new Date(b.end) && evEnd > new Date(b.start));
}


/* ─────────────────────── Component ─────────────────────── */
export default function AdminBigCalendar() {
  const { user } = useAuth();
  const ownerUid = getOwnerUid();

  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<RbcView>("week");
  const [items, setItems] = useState<CalItem[]>([]);
  const [err, setErr] = useState("");

  const [opened, setOpened] = useState<CalItem | null>(null);
  const [editing, setEditing] = useState<null | {
    apptId: string;
    initialDraft: AppointmentDraft;
    ownerUid: string;
  }>(null);

  const [blocks, setBlocks] = useState<any[]>([]);
  const [isBlockOpen, setBlockOpen] = useState(false);


  const { from, to } = useMemo(() => getRangeBounds(date, view), [date, view]);

  // апойнтменти
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

  // ⬇️ НОВЕ: блоки
  useEffect(() => {
    if (!ownerUid) return;
    const unsub = listenBlocksRange(
      ownerUid,
      from.getTime(),
      to.getTime(),
      (list: any[]) => setBlocks(list),
      (e: any) => console.warn("[Blocks]", e?.code || "", e?.message || e)
    );
    return () => unsub && unsub();
  }, [ownerUid, from, to]);

const events = useMemo(() => {
  const appts = mapToEvents(items);

  

  // 1) прибираємо «повнодобові» апойнтменти (це і є та плашка 00:00–23:59)
  // 2) ховаємо все, що перетинається з блоками (щоб візуально було ясно, що слот недоступний)
  return appts.filter(ev => {
    const s = ev.start as Date;
    const e = ev.end as Date;
    if (isFullDayRange(s, e)) return false;
    if (overlapsBlock(s, e, blocks)) return false;
    return true;
  });
}, [items, blocks]);
  const backgroundBlocks = useMemo(() => mapBlocksToBackground(blocks), [blocks]);

  const handleViewChange = useCallback((v: RbcView) => {
    setView(v);
  }, []);

  const handleNavigate = useCallback((newDate: Date, newView?: RbcView) => {
    if (newView) setView(newView);
    setDate(newDate);
  }, []);

  const handleRangeChange = useCallback((range: any) => {
    if (Array.isArray(range)) {
      const min = range.reduce((a, b) => (a < b ? a : b));
      setDate(min);
      return;
    }
    setDate(range.start);
  }, []);

  const onSelectEvent = useCallback((e: any) => {
    // На цьому етапі клікаємо лише по апойнтментах
    if (e?.resource?.isBlock) return;
    setOpened(e.resource as CalItem);
  }, []);

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
        onView={handleViewChange}
        onNavigate={(action) => {
          if (action === "TODAY") return setDate(new Date());
          const delta = view === "day" ? 1 : view === "week" ? 7 : 30;
          setDate((d) =>
            new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate() + (action === "NEXT" ? delta : -delta)
            )
          );
        }}
        rightSlot={
          <div className="flex gap-2">
            <AddAppointmentController />
<button className="px-3 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
        onClick={() => setBlockOpen(true)}>
  Block
</button>
          </div>
        }
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
          onView={handleViewChange}
          onNavigate={handleNavigate}
          onRangeChange={handleRangeChange}
          startAccessor="start"
          endAccessor="end"
          formats={formats}
          popup
          popupOffset={8}
          showMultiDayTimes
          style={{ height: "72vh", background: "white", borderRadius: 14, padding: 6 }}
          onSelectEvent={onSelectEvent}
          min={new Date(1970, 0, 1, 9, 0)}
          max={new Date(1970, 0, 1, 20, 0)}
          step={30}
          timeslots={2}
          {...({ showAllDay: false } as any)}

          /* ⬇️ НОВЕ: лише фон блоків */
          {...({
            backgroundEvents: backgroundBlocks,
            backgroundEventPropGetter: () => ({
              style: {
                backgroundColor: "#e5e7eb",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
              },
            }),
          } as any)}

          components={{ event: EventChip }}
        />
      </div>

      {/* Перегляд / редагування апойнтменту — як було */}
      {opened && (
        <AppointmentModal
          item={opened as any}
          onClose={() => setOpened(null)}
          onEditServices={(appt: any) => {
            const dateISO = appt.date ?? new Date(appt.start).toISOString().slice(0, 10);
            const startHHMM = timeUtils?.toHHMM?.(appt.start) ?? hhmmFromMs(appt.start);

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

      {editing && (
        <AddAppointmentModal
          mode="edit"
          ownerUid={editing.ownerUid}
          initialDraft={editing.initialDraft}
          apptId={editing.apptId}
          onClose={() => setEditing(null)}
        />
      )}

      {isBlockOpen && (
  <AddBlockModal
    ownerId={ownerUid!}
    defaultStart={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)}
    defaultEnd={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)}
    onClose={() => setBlockOpen(false)}
    onSaved={() => {}}
  />
)}

    </div>
  );
}
