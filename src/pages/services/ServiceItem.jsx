import ServiceVariant from "./ServiceVariant";

export default function ServiceItem({ title, desc, variants, notes }) {
  return (
    <div className="rounded-2xl border border-brand-accent/40 bg-brand-surface shadow-soft p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-brand-ink/70">{desc}</p>

      {variants && (
        <ul className="mt-4 space-y-1">
          {variants.map(v => (
            <ServiceVariant key={v.id} {...v} />
          ))}
        </ul>
      )}

      {notes && (
        <ul className="mt-4 text-xs text-brand-ink/60 list-disc list-inside space-y-1">
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}

      <div className="mt-6">
        <a href="/book" className="btn">Book</a>
      </div>
    </div>
  );
}
