import { useState } from "react";
import { updateProcedure, deleteProcedure, setProcedurePhotos } from "../../services/procedures";
import { uploadProcedurePhotos, deletePhoto } from "../../services/storage";

function toInputDate(ms) {
  try { return new Date(ms).toISOString().slice(0,10); } catch { return ""; }
}
function toMs(dateStr) {
  return new Date(dateStr).getTime();
}

export default function ProcedureRow({ clientId, p }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // локальні стейт-поля для редагування
  const [form, setForm] = useState({
    date: toInputDate(p.date),
    serviceType: p.serviceType || "",
    price: p.price ?? "",
    durationMin: p.durationMin ?? "",
    formula: p.formula || "",
    notes: p.notes || "",
  });

  const [newFiles, setNewFiles] = useState([]);
  const [photos, setPhotos] = useState(p.photos || []);

  const onChange = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const onSave = async () => {
    setError("");
    if (!form.serviceType.trim()) { setError("Service type is required"); return; }
    setSaving(true);
    try {
      await updateProcedure(clientId, p.id, {
        date: toMs(form.date),
        serviceType: form.serviceType,
        price: form.price === "" ? null : Number(form.price),
        durationMin: form.durationMin === "" ? null : Number(form.durationMin),
        formula: form.formula,
        notes: form.notes,
      });

      if (newFiles.length) {
     const uploaded = await uploadProcedurePhotos(p.stylistUid, clientId, p.id, newFiles);
    const merged = [...photos, ...uploaded];
     setPhotos(merged);
     await setProcedurePhotos(clientId, p.id, merged);
    setNewFiles([]);
   }
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this record?")) return;
    try { await deleteProcedure(clientId, p.id); } catch (e) { alert(e.message); }
  };

  if (!editing) {
    return (
      <div className="flex items-start justify-between rounded-xl border border-brand-accent/40 p-3">
        <div>
          <div className="font-medium">
            {p.serviceType || "—"} · {new Date(p.date).toLocaleDateString()}
          </div>
          <div className="text-sm text-brand-ink/70">
            {p.price != null && <>${p.price} · </>}
            {p.durationMin != null && <>{p.durationMin} min</>}
          </div>
          {(p.formula || p.notes) && (
            <div className="mt-1 text-sm text-brand-ink/80 whitespace-pre-line">
              {p.formula && <><strong>Formula:</strong> {p.formula}</>}
              {p.formula && p.notes ? <br/> : null}
              {p.notes && <><strong>Notes:</strong> {p.notes}</>}
            </div>
          )}
        </div>
        <div className="flex gap-2">
  <button
    onClick={() => setEditing(true)}
    className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
  >
    Edit
  </button>
  {/* <button
    onClick={() => setPreview(true)}
    className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
  >
    Preview
  </button> */}
  <button
    onClick={onDelete}
    className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
  >
    Delete
  </button>
</div>

      </div>
    );
  }

  // edit mode
  return (
    <div className="rounded-xl border border-brand-accent/40 p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          Date
          <input type="date" value={form.date} onChange={onChange("date")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
        <label className="text-sm">
          Service type
          <input value={form.serviceType} onChange={onChange("serviceType")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
        <label className="text-sm">
          Price
          <input type="number" inputMode="decimal" value={form.price} onChange={onChange("price")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
        <label className="text-sm">
          Duration (min)
          <input type="number" inputMode="numeric" value={form.durationMin} onChange={onChange("durationMin")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
        <label className="text-sm md:col-span-2">
          Formula / products
          <textarea rows={2} value={form.formula} onChange={onChange("formula")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
        <label className="text-sm md:col-span-2">
          Notes
          <textarea rows={2} value={form.notes} onChange={onChange("notes")}
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"/>
        </label>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      {Array.isArray(p.photos) && p.photos.length > 0 && (
  <div className="mt-2 grid grid-cols-3 gap-2">
    {p.photos.map((ph) => (
      <a key={ph.path} href={ph.url} target="_blank" rel="noreferrer"
         className="block overflow-hidden rounded-lg border border-brand-accent/40">
        <img src={ph.url} alt="" className="h-24 w-full object-cover" />
      </a>
    ))}
  </div>
)}


{/* існуючі фото з кнопкою видалення */}
{photos.length > 0 && (
  <div className="md:col-span-2">
    <div className="text-xs text-brand-ink/60 mb-1">Photos</div>
    <div className="grid grid-cols-3 gap-2">
      {photos.map(ph => (
        <div key={ph.path} className="relative group overflow-hidden rounded-lg border border-brand-accent/40">
          <img src={ph.url} alt="" className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={async () => {
              // видаляємо зі Storage
              await deletePhoto(ph.path);
              // видаляємо з локального масиву й у Firestore
              const next = photos.filter(x => x.path !== ph.path);
              setPhotos(next);
              await setProcedurePhotos(clientId, p.id, next);
            }}
            className="absolute top-1 right-1 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white opacity-0 group-hover:opacity-100 transition"
            title="Delete photo"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* додати нові фото */}
<label className="text-sm md:col-span-2">
  Add photos
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={e => setNewFiles(Array.from(e.target.files || []))}
    className="mt-1 block w-full text-sm"
  />
</label>



      <div className="mt-3 flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => { setEditing(false); setError(""); }}
          className="inline-flex rounded-xl border border-brand-accent/60 px-3 py-1 text-sm hover:bg-brand-accent/30"
        >
          Cancel
        </button>


      </div>

      
      
    </div>
  );
}
