import ServiceItem from "./ServiceItem";

export default function ServiceGrid({ services }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((svc) => (
        <ServiceItem key={svc.id} {...svc} />
      ))}
    </div>
  );
}
