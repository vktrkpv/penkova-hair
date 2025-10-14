import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../auth/AuthProvider";
import { listenProcedures, addProcedure, deleteProcedure, appendProcedurePhotos } from "../../services/procedures";
import ProcedureRow from "./ProcedureRow";
import { uploadProcedurePhotos } from "../../services/storage";
import { getOwnerUid } from "../../lib/ownerUid";

function fmtDate(ms) {
  try {
    const d = new Date(ms);
    return d.toLocaleDateString();
  } catch { return "—"; }
}

export default function ClientDetails() {
  const { id: clientId } = useParams();
  const { user } = useAuth();

  const [client, setClient] = useState(null);
  const [procs, setProcs] = useState([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingProcs, setLoadingProcs] = useState(true);
  const [err, setErr] = useState("");

  // поля форми
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [formula, setFormula] = useState("");
  const [notes, setNotes] = useState("");

  const [files, setFiles] = useState([]);


  useEffect(() => {
    // клієнт
    const ref = doc(db, "clients", clientId);
    const unsub = onSnapshot(ref, (snap) => {
      setClient(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoadingClient(false);
    }, (e) => { setErr(e.message); setLoadingClient(false); });
    return () => unsub();
  }, [clientId]);

  useEffect(() => {
    // процедури
    const unsub = listenProcedures(
      clientId,
      (list) => { setProcs(list); setLoadingProcs(false); },
      (e) => { setErr(e.message); setLoadingProcs(false); }
    );
    return () => unsub && unsub();
  }, [clientId]);

  const onAdd = async (e) => {
    e.preventDefault();
    setErr("");
    if (!serviceType.trim()) { setErr("Service type is required"); return; }

    try {
      const ref = await addProcedure(clientId, {
        date: new Date(date),
        serviceType,
        price,
        durationMin,
        formula,
        notes,
        stylistUid: getOwnerUid(),
      });

      const procId = ref.id;

      if (files.length) {
    const uploaded = await uploadProcedurePhotos(user.uid, clientId, procId, files);
     if (uploaded.length) {
       await appendProcedurePhotos(clientId, procId, uploaded);
     }
     setFiles([]);
   }





      
      // очистити форму (залишимо дату)
      setServiceType(""); setPrice(""); setDurationMin(""); setFormula(""); setNotes("");
    } catch (e) {
      setErr(e.message);
    }
  };

  const onDelete = async (procId) => {
    if (!confirm("Delete this record?")) return;
    try { await deleteProcedure(clientId, procId); } catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client</h1>
        <Link to="/admin/clients" className="text-sm underline hover:text-brand-primary">
          ← Back to clients
        </Link>
      </div>

      {/* Client card */}
      <div className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-6 shadow-soft">
        {loadingClient ? (
          <div className="text-brand-ink/60">Loading client…</div>
        ) : client ? (
          <>
            <div className="text-xl font-medium">{client.name}</div>
            <div className="text-sm text-brand-ink/70">
              {client.phone && <>📞 {client.phone} · </>}
              {client.email && <>✉️ {client.email}</>}
            </div>
            {client.notes && <div className="mt-2 text-sm text-brand-ink/80">{client.notes}</div>}
          </>
        ) : (
          <div className="text-red-600">Client not found.</div>
        )}
      </div>

      {/* Add procedure form */}
      <form onSubmit={onAdd} className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Add procedure</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Date
            <input
              type="date"
              value={date}
              onChange={e=>setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
          <label className="text-sm">
            Service type
            <input
              value={serviceType}
              onChange={e=>setServiceType(e.target.value)}
              placeholder="Blonding / Women's cut / Treatment…"
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
          <label className="text-sm">
            Price
            <input
              type="number" inputMode="decimal"
              value={price}
              onChange={e=>setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
          <label className="text-sm">
            Duration (min)
            <input
              type="number" inputMode="numeric"
              value={durationMin}
              onChange={e=>setDurationMin(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Formula / products
            <textarea
              rows={2}
              value={formula}
              onChange={e=>setFormula(e.target.value)}
              placeholder="Developer 6%, toner 9/16 …"
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Notes
            <textarea
              rows={2}
              value={notes}
              onChange={e=>setNotes(e.target.value)}
              placeholder="Any special care / recommendations"
              className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            />
          </label>
        </div>

        <label className="text-sm md:col-span-2">
  Photos
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={e => setFiles(Array.from(e.target.files || []))}
    className="mt-1 block w-full text-sm"
  />
</label>


        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        <button className="btn mt-4">Save procedure</button>
      </form>

      {/* Procedures list */}
      <div className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold">History</h2>
        <div className="mt-3 grid gap-3">
          {loadingProcs && <div className="text-brand-ink/60">Loading…</div>}
          {!loadingProcs && procs.length === 0 && (
            <div className="text-brand-ink/60">No procedures yet.</div>
          )}
          {procs.map(p => (
  <ProcedureRow key={p.id} clientId={clientId} p={p} />
))}
        </div>
      </div>
    </div>
  );
}
