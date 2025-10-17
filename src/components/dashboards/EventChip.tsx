type Props = { event: any };

export default function EventChip({ event }: Props) {
  // У нас повні дані події лежать у event.resource (якщо ти їх туди передаєш),
  // але підстрахуємося й візьмемо з event напряму, якщо resource нема.
  const a = event?.resource ?? event ?? {};

  const status: "booked" | "confirmed" | "paid" | "canceled" =
    a.status ?? "booked";

  // Ім'я клієнта (спершу clientName, далі client.name)
  const clientName =
    a.clientName ||
    a.client?.name ||
    [a.client?.firstName, a.client?.lastName].filter(Boolean).join(" ") ||
    "Client";

  // Назви послуг: serviceName → serviceNames[] → services[].name
  const servicesText =
    a.serviceName ||
    (Array.isArray(a.serviceNames) && a.serviceNames.length
      ? a.serviceNames.join(" + ")
      : Array.isArray(a.services) && a.services.length
      ? a.services.map((s: any) => s?.name).filter(Boolean).join(" + ")
      : "");

  const cls =
    status === "paid"
      ? "rbc-chip rbc-chip--paid"
      : status === "confirmed"
      ? "rbc-chip rbc-chip--confirmed"
      : status === "canceled"
      ? "rbc-chip rbc-chip--canceled"
      : "rbc-chip rbc-chip--booked";

  return (
    <div className={cls}>
      <div className="rbc-chip-time">
        {new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
        {new Date(event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="rbc-chip-title">
        {clientName}
        {servicesText ? " — " + servicesText : ""}
      </div>
      <div className="rbc-chip-sub">{status}</div>
    </div>
  );
}
