import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { addClient, listenMyClients, deleteClient } from "../../services/clients";

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // поля форми
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // простий пошук по імені (на клієнті)
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = listenMyClients(
      user.uid,
      (list) => { setClients(list); setLoading(false); },
      (e) => { setErr(e.message); setLoading(false); }
    );
    return () => unsub && unsub();
  }, [user]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(c => c.nameLower?.includes(s));
  }, [clients, q]);

  const onAdd = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Name is required"); return; }
    try {
      await addClient({ ownerUid: user.uid, name, phone, email, notes });
      setName(""); setPhone(""); setEmail(""); setNotes("");
    } catch (e) {
      setErr(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this client?")) return;
    try { await deleteClient(id); } catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок + пошук */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search by name…"
          className="w-full md:w-72 rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
        />
      </div>

      {/* Форма додавання */}
      <form onSubmit={onAdd} className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Name
            <input value={name} onChange={e=>setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60" />
          </label>
          <label className="text-sm">
            Phone
            <input value={phone} onChange={e=>setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60" />
          </label>
          <label className="text-sm">
            Email
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60" />
          </label>
          <label className="text-sm md:col-span-2">
            Notes
            <textarea value={notes} onChange={e=>setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60" />
          </label>
        </div>
        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        <button className="btn mt-4">Add client</button>
      </form>

      {/* Список клієнтів */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading && <div className="text-brand-ink/60">Loading…</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-brand-ink/60">No clients yet.</div>
        )}
        {filtered.map(c => (
          <div key={c.id}
            className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-medium">{c.name}</div>
                <div className="text-sm text-brand-ink/70">
                  {c.phone && <>📞 {c.phone} · </>}
                  {c.email && <>✉️ {c.email}</>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/admin/clients/${c.id}`}
                  className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
                >
                  Open
                </a>
                <button
                  onClick={() => onDelete(c.id)}
                  className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
                  title="Delete client"
                >
                  Delete
                </button>
              </div>
            </div>
            {c.notes && <div className="mt-2 text-sm text-brand-ink/80">{c.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
