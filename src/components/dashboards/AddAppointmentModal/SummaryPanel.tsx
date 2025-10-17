import { ServiceItem } from "../../../types/appointments";
import type { ClientMini } from "../../../types/appointments";

export default function SummaryPanel({
  mode = "compact",
  services = [],
  totalDuration = 0,
  totalPrice = 0,
  client = null,
  dateISO = null,      
  start = null,         
}: {
  mode?: "compact" | "full";
  services?: ServiceItem[];
  totalDuration?: number;
  totalPrice?: number;
  client?: ClientMini | null;
  dateISO?: string | null;
  start?: string | null;
}) {
  return (
    <div className="rounded-xl border border-[var(--brand-border,#e5e7eb)] p-4 bg-white">
      <h5 className="font-semibold mb-2">
        {mode === "full" ? "Summary" : "Appointment Summary"}
      </h5>

      {(client || dateISO || start) && (
        <div className="text-sm text-gray-700 mb-3 space-y-1">
          {client && (
            <div>
              <span className="opacity-60">Client: </span>
              <span className="font-medium">{client.name}</span>
              <span className="opacity-60">
                {client.phone ? ` · ${client.phone}` : ""}
                {client.email ? ` · ${client.email}` : ""}
              </span>
            </div>
          )}
          {(dateISO || start) && (
            <div className="opacity-80">
              <span className="opacity-60">When: </span>
              <span>{dateISO ?? "—"}</span>
              {start ? ` · ${start}` : ""}
            </div>
          )}
        </div>
      )}

      {services.length === 0 ? (
        <p className="text-sm text-gray-600">No services selected yet.</p>
      ) : (
        <ul className="text-sm text-gray-700 space-y-1 mb-3">
          {services.map((s) => (
            <li key={s.id} className="flex items-center justify-between">
              <span className="truncate">{s.name}</span>
              <span className="opacity-70">
                {s.duration} min{typeof s.price === "number" ? ` · $${s.price}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-sm">
        <div className="flex justify-between">
          <span className="opacity-60">Total duration:</span>
          <span>{totalDuration} min</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-60">Total price:</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      {mode === "full" && (
        <p className="mt-3 text-xs text-gray-500">
          You can still go back and change details before confirming.
        </p>
      )}
    </div>
  );
}
