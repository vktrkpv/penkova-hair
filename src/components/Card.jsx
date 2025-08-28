export default function Card({ children }) {
  return (
    <div className="bg-brand-surface border border-brand-ink/10 rounded-2xl p-6 shadow-soft">
      {children}
    </div>
  );
}
