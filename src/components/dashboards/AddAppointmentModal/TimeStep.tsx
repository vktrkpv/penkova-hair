// src/components/dashboards/AddAppointmentModal/TimeStep.tsx
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppointmentDraft } from "../../../types/appointments";
import { getAvailabilityForDate } from "../../../services/availability";
import { fetchBusyForDate, generateSlots } from "../../../services/appointments";

type Props = {
  visible: boolean;
  ownerUid: string | null;
  totalDuration: number;
  draft: AppointmentDraft;
  setDraft: Dispatch<SetStateAction<AppointmentDraft>>;
};

export default function TimeStep({
  visible,
  ownerUid,
  totalDuration,
  draft,
  setDraft,
}: Props) {
  if (!visible) return null;

  const [dateISO, setDateISO] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      if (!ownerUid || !dateISO) return;
      setLoading(true);
      setErr(null);
      try {
        const avail = await getAvailabilityForDate(ownerUid, dateISO);
        if (!avail || avail.closed) {
          if (!stop) setSlots([]);
          return;
        }
        const busy = await fetchBusyForDate(ownerUid, dateISO);
        const newSlots = generateSlots({
          dayStart: avail.start,
          dayEnd: avail.end,
          stepMin: avail.stepMin || 15,
          durationMin: totalDuration || 30,
          busy,
          dayBreaks: avail.breaks || [],
        });
        if (!stop) setSlots(newSlots);
      } catch (e: any) {
        if (!stop) setErr(e?.message || String(e));
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [ownerUid, dateISO, totalDuration]);

  // ✅ безпечна перевірка, бо draft.date може бути null
  const selected =
    draft.start &&
    draft.date &&
    dateISO === draft.date?.toISOString().slice(0, 10)
      ? draft.start
      : null;

  const onPick = (hhmm: string) => {
    // ✅ явно підписуємо тип p, щоб TS не сварився
    setDraft((p: AppointmentDraft) => ({ ...p, date: new Date(dateISO), start: hhmm }));
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Date & Time</h4>

      <label className="block text-sm">Date</label>
      <input
        type="date"
        value={dateISO}
        onChange={(e) => setDateISO(e.target.value)}
        className="px-3 py-2 border rounded-xl"
      />

      {loading && <div className="text-sm text-gray-500">Loading slots…</div>}
      {err && <div className="text-sm text-red-600">Error: {err}</div>}
      {!loading && !err && slots.length === 0 && (
        <div className="text-sm text-gray-500">No available time slots for this date.</div>
      )}

      {slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slots.map((t) => (
            <button
              key={t}
              onClick={() => onPick(t)}
              className={`px-3 py-1.5 text-xs rounded-full border ${
                selected === t ? "bg-[var(--brand-surface)]" : "bg-white hover:bg-[var(--brand-surface)]/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
