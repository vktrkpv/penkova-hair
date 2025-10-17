import { useState } from "react";
import { addBlock } from "../../../services/blocks";

type Props = {
  ownerId: string;
  defaultStart?: Date;
  defaultEnd?: Date;
  onClose: () => void;
  onSaved?: () => void;
};

type Quick = "halfday" | "fullday" | "week";

export default function AddBlockModal({
  ownerId,
  defaultStart,
  defaultEnd,
  onClose,
  onSaved,
}: Props) {
  const [start, setStart] = useState<Date>(defaultStart || new Date());
  const [end, setEnd] = useState<Date>(defaultEnd || new Date(Date.now() + 60 * 60 * 1000));
  const [reason, setReason] = useState<string>("");

  const quick = (q: Quick) => {
    const now = new Date();
    if (q === "halfday") {
      setStart(now);
      setEnd(new Date(now.getTime() + 4 * 60 * 60 * 1000));
    } else if (q === "fullday") {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      setStart(s);
      setEnd(e);
    } else {
      setStart(now);
      setEnd(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const save = async () => {
    await addBlock(ownerId, start.getTime(), end.getTime(), reason.trim());
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Add Block</h2>

        <div className="flex gap-2">
          <button className="rounded bg-gray-100 px-2 py-1" onClick={() => quick("halfday")}>
            Half-day
          </button>
          <button className="rounded bg-gray-100 px-2 py-1" onClick={() => quick("fullday")}>
            Full day
          </button>
          <button className="rounded bg-gray-100 px-2 py-1" onClick={() => quick("week")}>
            Week
          </button>
        </div>

        <label className="block text-sm font-medium">Start</label>
        <input
          type="datetime-local"
          className="w-full rounded border px-3 py-2"
          value={toInput(start)}
          onChange={(e) => setStart(fromInput(e.target.value))}
        />

        <label className="block text-sm font-medium">End</label>
        <input
          type="datetime-local"
          className="w-full rounded border px-3 py-2"
          value={toInput(end)}
          onChange={(e) => setEnd(fromInput(e.target.value))}
        />

        <label className="block text-sm font-medium">Reason (optional)</label>
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Vacation / Training / Sick day …"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex items-center justify-between pt-1 text-sm text-gray-600">
          <span>Duration: {formatDuration(start, end)}</span>
          <div className="flex gap-2">
            <button className="rounded bg-gray-100 px-3 py-2" onClick={onClose}>
              Cancel
            </button>
            <button className="rounded bg-gray-800 px-3 py-2 text-white" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function toInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(
    d.getMinutes()
  )}`;
}
function fromInput(s: string): Date {
  return new Date(s);
}
function formatDuration(a: Date, b: Date): string {
  const ms = Math.max(0, b.getTime() - a.getTime());
  const h = Math.floor(ms / 3600000);
  const m = Math.round((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}
