import { useEffect, useMemo, useState } from "react";
import { startOfWeek, addWeeks, addDays, format } from "date-fns";
import { useAuth } from "../../auth/AuthProvider";
import { listenAppointmentsRange } from "../../services/appointments";

export default function AdminCalendar() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

  useEffect(() => {
    if (!user) return;
    const fromMs = weekStart.getTime();
    const toMs = weekEnd.getTime();

    const unsub = listenAppointmentsRange(
      user.uid,
      fromMs,
      toMs,
      (list) => setItems(list),
      (e) => {
        console.warn("[Calendar]", e.code, e.message);
        setErr(e.code === "failed-precondition" ? "Firestore index is building…" : "");
      }
    );
    return () => unsub && unsub();
  }, [user, weekStart, weekEnd]);

  const prevWeek = () => setWeekStart((d) => addWeeks(d, -1));
  const nextWeek = () => setWeekStart((d) => addWeeks(d, 1));
  const thisWeek = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Групуємо ап-ті по днях: ключ yyyy-MM-dd
  const days = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < 7; i++) {
      const d = addDays(weekStart, i);
      const key = format(d, "yyyy-MM-dd");
      map.set(key, { date: d, items: [] });
    }
    for (const a of items) {
      const key = format(new Date(a.start), "yyyy-MM-dd");
      if (map.has(key)) map.get(key).items.push(a);
    }
    // сортуємо в кожному дні за часом
    for (const v of map.values()) {
      v.items.sort((a, b) => a.start - b.start);
    }
    return Array.from(map.values());
  }, [items, weekStart]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="flex gap-2">
          <button className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1" onClick={prevWeek}>← Prev</button>
          <button className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1" onClick={thisWeek}>This week</button>
          <button className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1" onClick={nextWeek}>Next →</button>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          {err}
        </div>
      )}

      <div className="rounded-2xl border border-brand-accent/40 bg-brand-surface p-4 shadow-soft">
        <div className="text-sm text-brand-ink/60">
          Week of <strong>{format(weekStart, "dd MMM yyyy")}</strong>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {days.map(({ date, items }) => (
            <div key={format(date, "yyyy-MM-dd")} className="rounded-xl border border-brand-accent/40 p-3">
              <div className="mb-2 text-sm font-medium">
                {format(date, "EEE, dd MMM")}
              </div>
              {items.length === 0 ? (
                <div className="text-sm text-brand-ink/60">No appointments</div>
              ) : (
                <ul className="space-y-2">
                  {items.map(a => (
                    <li key={a.id} className="rounded-lg border border-brand-accent/40 p-2">
                      <div className="text-sm font-medium">
                        {format(new Date(a.start), "HH:mm")} – {format(new Date(a.end), "HH:mm")}
                      </div>
                      <div className="text-sm">
                        {a.clientName || "Client"}{a.serviceName ? ` · ${a.serviceName}` : ""}{a.price != null ? ` · $${a.price}` : ""}
                      </div>
                      <div className="text-xs text-brand-ink/60">{a.status || "booked"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
