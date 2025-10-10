import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const nav = useNavigate();
  return (
    <div className="rounded-2xl border border-brand-accent/40 bg-brand-surface p-4 shadow-soft">
      <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => nav("/admin/clients")}
          className="btn"
        >
          Add client
        </button>
        <button
          onClick={() => nav("/admin/calendar")}
          className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-2 text-sm hover:bg-brand-accent/30"
        >
          Go to Calendar
        </button>
        <button
          onClick={() => nav("/admin/clients")}
          className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-2 text-sm hover:bg-brand-accent/30"
          title="New procedure via client card"
        >
          New procedure…
        </button>

        
      </div>
      <p className="mt-3 text-xs text-brand-ink/60">
        “New procedure…” відкриє вибір клієнта в наступному етапі.
      </p>
    </div>
  );
}
