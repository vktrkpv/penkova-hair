import {
  addDoc, collection, serverTimestamp,
  query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from "../lib/firebase";

// посилання на підколекцію процедур клієнта
const procsCol = (clientId) => collection(db, "clients", clientId, "procedures");

export function listenProcedures(clientId, cb, onError) {
  const q = query(procsCol(clientId), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(list);
  }, onError);
}

export async function addProcedure(clientId, data) {
  // очікуємо date (ms або Date), serviceType, notes?, price?
  const dateMs = data.date instanceof Date ? data.date.getTime() : Number(data.date);
  return addDoc(procsCol(clientId), {
    date: dateMs,                       // зберігаємо як мілісекунди (простий формат)
    serviceType: data.serviceType || "",
    formula: data.formula || "",
    products: data.products || [],
    price: data.price != null ? Number(data.price) : null,
    durationMin: data.durationMin != null ? Number(data.durationMin) : null,
    stylistUid: data.stylistUid,       // user.uid
    notes: data.notes || "",
    createdAt: serverTimestamp(),
  });
}

export async function deleteProcedure(clientId, procId) {
  const ref = doc(db, "clients", clientId, "procedures", procId);
  return deleteDoc(ref);
}

export async function updateProcedure(clientId, procId, patch) {
  const ref = doc(db, "clients", clientId, "procedures", procId);
  const norm = { ...patch };

  if (norm.date != null) {
    norm.date = norm.date instanceof Date ? norm.date.getTime() : Number(norm.date);
  }
  if (norm.price != null) norm.price = Number(norm.price);
  if (norm.durationMin != null) norm.durationMin = Number(norm.durationMin);

  return updateDoc(ref, norm);
}

// додати фото (масив об'єктів {path, url})
export async function appendProcedurePhotos(clientId, procId, photos) {
  const ref = doc(db, "clients", clientId, "procedures", procId);
  return updateDoc(ref, { photos: arrayUnion(...photos) });
}

// замінити весь масив фото (коли видаляємо по path)
export async function setProcedurePhotos(clientId, procId, photos) {
  const ref = doc(db, "clients", clientId, "procedures", procId);
  return updateDoc(ref, { photos });
}
