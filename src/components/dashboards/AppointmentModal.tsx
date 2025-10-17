// src/components/dashboards/AppointmentModal.tsx
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  updateAppointment,
  deleteAppointment,
  fetchBusyForDate,
  generateSlots,
  timeUtils,
} from "../../services/appointments";
import { getAvailabilityForDate } from "../../services/availability";

type Appointment = {
  id: string;
  start: number;
  end: number;
  clientName?: string;
  serviceName?: string; 
  price?: number | null;
  status?: "booked" | "confirmed" | "paid" | "canceled";
  stylistUid?: string;
  durationMin?: number;
  date?: string; 
};

export default function AppointmentModal({
  item,
  onClose,
  onEditServices, 
}: {
  item: Appointment;
  onClose: () => void;
  onEditServices?: (appt: Appointment) => void;
}) {
  const [mode, setMode] = useState<"view" | "time">("view");

  const [dateISO, setDateISO] = useState<string>(() =>
    item.date ? item.date : new Date(item.start).toISOString().slice(0, 10)
  );
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotErr, setSlotErr] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "time" || !item.stylistUid || !dateISO) return;
    let stop = false;
    (async () => {
      try {
        setSlotLoading(true);
        setSlotErr(null);
        const avail = await getAvailabilityForDate(item.stylistUid!, dateISO);
        if (!avail || avail.closed) {
          if (!stop) setSlots([]);
          return;
        }
        const busy = await fetchBusyForDate(item.stylistUid!, dateISO);
        const duration =
          item.durationMin || Math.round((item.end - item.start) / 60000);
        const s = generateSlots({
          dayStart: avail.start,
          dayEnd: avail.end,
          stepMin: avail.stepMin || 15,
          durationMin: duration,
          busy,
          dayBreaks: avail.breaks || [],
        });
        if (!stop) setSlots(s);
      } catch (e: any) {
        if (!stop) setSlotErr(e?.message || String(e));
      } finally {
        if (!stop) setSlotLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [mode, item.stylistUid, dateISO, item.durationMin, item.start, item.end]);

  const saveTime = async () => {
    if (!picked) return;
    const startMs = timeUtils.makeMs(dateISO, picked);
    const duration =
      item.durationMin || Math.round((item.end - item.start) / 60000);
    const endMs = startMs + duration * 60 * 1000;
    await updateAppointment(item.id, {
      start: startMs,
      end: endMs,
      date: dateISO,
    });
    onClose();
  };

  const setStatus = async (
    status: "booked" | "confirmed" | "paid" | "canceled"
  ) => {
    await updateAppointment(item.id, { status });
    onClose();
  };

  const onDelete = async () => {
    if (!confirm("Delete this appointment?")) return;
    await deleteAppointment(item.id);
    onClose();
  };

  const isCanceled = item.status === "canceled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold">Appointment</h3>
          <button
            className="text-sm text-neutral-600 hover:opacity-80"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {mode === "view" ? (
          <>
            <div className="space-y-2 text-sm">
              <div>
                <span className="opacity-60">Client:</span>{" "}
                {item.clientName || "Client"}
              </div>
              <div>
                <span className="opacity-60">Service:</span>{" "}
                {item.serviceName || "—"}
              </div>
              <div>
                <span className="opacity-60">Price:</span>{" "}
                {item.price != null ? `$${item.price}` : "—"}
              </div>
              <div>
                <span className="opacity-60">Time:</span>{" "}
                {format(new Date(item.start), "dd MMM, HH:mm")} –{" "}
                {format(new Date(item.end), "HH:mm")}
              </div>
              <div>
                <span className="opacity-60">Status:</span>{" "}
                {item.status ?? "booked"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {!isCanceled && (
                <>
                  <button
                    onClick={() => setStatus("confirmed")}
                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setStatus("paid")}
                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => setStatus("canceled")}
                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {isCanceled && (
                <button
                  onClick={() => setStatus("booked")}
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                >
                  Restore
                </button>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMode("time")}
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                >
                  Edit time
                </button>
                <button
                  onClick={() =>
                    onEditServices
                      ? onEditServices(item)
                      : alert(
                          "Hook up onEditServices to open your AddAppointmentModal in edit mode"
                        )
                  }
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
                >
                  Edit services
                </button>

                <button
                  onClick={onDelete}
                  className="ml-auto px-3 py-1.5 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-neutral-700">Reschedule</div>

            <label className="block text-sm">Date</label>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => {
                setDateISO(e.target.value);
                setPicked(null);
              }}
              className="px-3 py-2 border rounded-xl"
            />

            {slotLoading && (
              <div className="text-sm text-gray-500">Loading slots…</div>
            )}
            {slotErr && (
              <div className="text-sm text-red-600">Error: {slotErr}</div>
            )}
            {!slotLoading && !slotErr && slots.length === 0 && (
              <div className="text-sm text-gray-500">No available slots.</div>
            )}

            {slots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setPicked(t)}
                    className={`px-3 py-1.5 text-xs rounded-full border ${
                      picked === t
                        ? "bg-[var(--brand-surface)]"
                        : "bg-white hover:bg-[var(--brand-surface)]/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setMode("view")}
                className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={saveTime}
                disabled={!picked}
                className={`px-3 py-1.5 text-sm rounded-lg text-white ${
                  picked
                    ? "bg-[var(--brand-primary,#3A5D56)] hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
