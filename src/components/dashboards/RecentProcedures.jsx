export default function RecentProcedures({ items = [] }) {
  return (
    <div className="rounded-2xl border border-brand-accent/40 bg-brand-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent procedures</h3>
        <span className="text-xs text-brand-ink/60">last 5</span>
      </div>

      {items.length === 0 ? (
        <div className="text-brand-ink/60 text-sm">No procedures yet.</div>
      ) : (
        <ul className="divide-y divide-brand-accent/30">
          {items.map((it) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {it.serviceType || "—"} · {it.clientName || "Unknown"}
                  {it.price != null && <> · ${it.price}</>}
                </div>
                <div className="text-xs text-brand-ink/60">{it.dateStr}</div>
              </div>
              <a
                href={`/admin/clients/${it.clientId}`}
                className="text-sm rounded-xl border border-brand-accent/60 px-3 py-1 hover:bg-brand-accent/30"
              >
                Open
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
