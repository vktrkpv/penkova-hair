import ServiceItem from "./ServiceItem";

export default function ServiceSection({ category, services }) {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold text-brand-ink mb-6">{category}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(svc => (
          <ServiceItem key={svc.id} {...svc} />
        ))}
      </div>
    </section>
  );
}
