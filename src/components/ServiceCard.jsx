import { Link } from "react-router-dom";

export default function ServiceCard({ title, desc, price, ctaTo = "/book" }) {
  return (
    <div className="h-full rounded-2xl bg-brand-surface border border-brand-accent/50 p-6 shadow-soft">
      <h3 className="text-xl font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-brand-ink/70">{desc}</p>
      <div className="mt-4 text-sm text-brand-ink/80">{price}</div>

      <div className="mt-6 flex gap-3">
        <Link to={ctaTo} className="btn">Book</Link>
        <Link
          to="/services"
          className="inline-flex items-center rounded-xl border border-brand-accent px-4 py-2 text-brand-ink hover:bg-brand-accent/30 transition"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
