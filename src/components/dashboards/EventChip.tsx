type Props = { event: any };

export default function EventChip({ event }: Props) {
  const i = event.resource || {};
  const status: "booked" | "confirmed" | "paid" | "canceled" = i.status ?? "booked";

  // клас за статусом
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
        {/* Дублюємо час у самому чіпі, щоб завжди було видно */}
        {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
        {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="rbc-chip-title">{event.title}</div>
      <div className="rbc-chip-sub">{status}</div>
    </div>
  );
}
