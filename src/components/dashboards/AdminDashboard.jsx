import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  return (
    <div>
      <AdminSidebar />
      <div className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-6 shadow-soft">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-brand-ink/70">Quick stats coming soon…</p>
    </div>
    </div>
  );
}
