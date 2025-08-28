export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && <div className="text-brand-ink/60 tracking-widest uppercase text-xs">{eyebrow}</div>}
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-brand-ink">{title}</h2>
      {subtitle && <p className="mt-3 text-brand-ink/70 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
