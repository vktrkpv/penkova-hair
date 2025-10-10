export default function StatsCards({ stats = {} }) {
  const {
    clientsCount = "—",
    proceduresCount30d = "—",
    revenue30d = "—",
    upcoming7d = "—",
  } = stats;
  const Card = ({ label, value, hint }) => (
    <div className="rounded-2xl border border-brand-accent/40 bg-brand-surface p-4 shadow-soft">
      <div className="text-sm text-brand-ink/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-brand-ink/50">{hint}</div>}
    </div>
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Clients" value={clientsCount} hint="Total clients" />
      <Card label="Procedures (30d)" value={proceduresCount30d} hint="Last 30 days" />
      <Card label="Revenue (30d)" value={revenue30d} hint="Sum of prices" />
      <Card label="Upcoming (7d)" value={upcoming7d} hint="Calendar items" />
    </div>
  );
}
