export default function ServiceVariant({ label, durationMin, price, priceRange }) {
  return (
    <li className="flex justify-between items-center py-1 text-sm text-brand-ink/80">
      <span>{label} · {durationMin} min</span>
      <span className="font-medium text-brand-primary">
        {priceRange 
          ? `$${priceRange[0]}–$${priceRange[1]}`
          : `$${price}`}
      </span>
    </li>
  );
}
