// src/components/dashboards/add-appointment/AddAppointmentModal/ClientStep.tsx
import { useEffect, useState } from "react";
import type { ClientMini } from "../../../types/appointments";

// ⬇️ імпортуємо з твого сервісу саме ці дві функції
import { searchClients, addClient } from "../../../services/clients";

type Props = {
  visible: boolean;
  value: ClientMini | null;
  onChange: (c: ClientMini | null) => void;
  ownerUid: string | null;
};

type Tab = "existing" | "new" | "quick";

export default function ClientStep({ visible, value, onChange, ownerUid }: Props) {
  const [tab, setTab] = useState<Tab>("existing");
  if (!visible) return null;

  return (
    <div className="space-y-4">
      {/* Таби */}
      <div className="flex flex-wrap gap-2">
        {(["existing", "new", "quick"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs rounded-full border ${
              tab === t
                ? "bg-[var(--brand-surface)] border-[var(--brand-border)]"
                : "bg-white hover:bg-[var(--brand-surface)]/70 border-[var(--brand-border)]"
            }`}
          >
            {t === "existing" ? "Existing" : t === "new" ? "Add New" : "Quick entry"}
          </button>
        ))}
      </div>

      {tab === "existing" && (
        <Existing value={value} onChange={onChange} ownerUid={ownerUid} />
      )}

      {tab === "new" && (
        <ClientForm
          key="new"
          submitLabel="Add client"
          onSubmit={async (c) => {
            if (!ownerUid) return; // якщо юзер не залогінений — просто не пишемо
            // ⬇️ створюємо документ у Firestore
            const docRef = await addClient({
              ownerUid,
              name: c.name,
              phone: c.phone ?? "",
              email: c.email ?? "",
              notes: "",
            });
            // зберігач повертає лише ref, тому формуємо вибраного клієнта самі
onChange({
  id: docRef.id,
  name: c.name,
  phone: c.phone,
  email: c.email,
});            // (необов’язково) перемкнутись на Existing:
            // setTab("existing");
          }}
        />
      )}

      {tab === "quick" && (
        <ClientForm key="quick" submitLabel="Use without saving" onSubmit={(c) => onChange(c)} />
      )}

      <div className="text-xs text-gray-500">
        Selected: {value ? <b>{value.name}</b> : "— none —"}
      </div>
    </div>
  );
}

function Existing({
  value,
  onChange,
  ownerUid,
}: {
  value: ClientMini | null;
  onChange: (c: ClientMini) => void;
  ownerUid: string | null;
}) {
  const [q, setQ] = useState("");
  const [list, setList] = useState<ClientMini[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let stop = false;

    // ⬇️ не робимо запит, якщо немає ownerUid (не залогінені)
    if (!ownerUid) {
      setList([]);
      return;
    }

    setLoading(true);
    (async () => {
      // ⬇️ ВАЖЛИВО: порядок аргументів = (ownerUid, qStr)
      const res = await searchClients(ownerUid, q, 20);
      if (!stop) {
        setList(res);
        setLoading(false);
      }
    })();

    return () => {
      stop = true;
    };
  }, [q, ownerUid]);

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, phone, or email…"
        className="w-full sm:w-96 px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#3A5D56)]"
      />

      <div className="rounded-xl border border-[var(--brand-border)] bg-white divide-y max-h-72 overflow-auto">
        {loading && <div className="p-3 text-sm text-gray-500">Loading…</div>}
        {!loading && list.length === 0 && (
          <div className="p-3 text-sm text-gray-500">No results. Try another query.</div>
        )}

        {list.map((c) => {
          const selected = value?.id === c.id;
          return (
            <button
              key={c.id ?? c.name}
              onClick={() => onChange(c)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--brand-surface)]/70 ${
                selected ? "bg-[var(--brand-surface)]" : ""
              }`}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs opacity-70">{c.phone ?? "—"} · {c.email ?? "—"}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ClientForm({
  submitLabel,
  onSubmit,
}: {
  submitLabel: string;
  onSubmit: (c: ClientMini) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit = name.trim().length >= 2;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        });
      }}
      className="space-y-3 max-w-md"
    >
      <div>
        <label className="block text-xs mb-1">Full name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#3A5D56)]"
          placeholder="Client name"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none"
            placeholder="+1 …"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none"
            placeholder="mail@example.com"
          />
        </div>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-3 py-2 text-sm rounded-xl text-white ${
            canSubmit
              ? "bg-[var(--brand-primary,#3A5D56)] hover:opacity-90"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
