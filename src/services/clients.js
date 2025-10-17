// src/services/clients.js
import {
  addDoc, collection, serverTimestamp,
  query, where, orderBy, onSnapshot, getDocs, startAt, endAt, limit,
  updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../lib/firebase";

const clientsCol = collection(db, "clients");

// helpers
const toLower = (s = "") => s.trim().toLowerCase();
const normalizePhone = (s = "") => s.replace(/\D/g, ""); 

const lastLower = (name = "") => {
  const parts = toLower(name).split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
};

export function listenMyClients(ownerUid, cb, onError) {
  const q = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("nameLower")
  );
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export async function addClient({ ownerUid, name, phone = "", email = "", notes = "" }) {
  const now = serverTimestamp();
  return addDoc(clientsCol, {
    ownerUid,
    name: name.trim(),
    nameLower: toLower(name),
    lastNameLower: lastLower(name),
    phone: phone.trim(),
    phoneLower: normalizePhone(phone),   
    email: email.trim(),
    emailLower: toLower(email),          
    notes: notes.trim(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateClient(id, data) {
  const ref = doc(db, "clients", id);
  const patch = {
    ...data,
    ...(data.name  ? { nameLower: toLower(data.name), lastNameLower: lastLower(data.name) } : {}),
    ...(data.phone ? { phoneLower: normalizePhone(data.phone) } : {}), 
    ...(data.email ? { emailLower: toLower(data.email) }   : {}),
    updatedAt: serverTimestamp(),
  };
  return updateDoc(ref, patch);
}

export async function deleteClient(id) {
  const ref = doc(db, "clients", id);
  return deleteDoc(ref);
}


export async function searchClients(ownerUid, qStr = "", max = 20) {
  const q = qStr.trim();
  const qLower = toLower(q);
  const qPhone = normalizePhone(q);

  if (!q) {
    const base = query(
      clientsCol,
      where("ownerUid", "==", ownerUid),
      orderBy("nameLower"),
      limit(max)
    );
    const snap = await getDocs(base);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  const byName = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("nameLower"),
    startAt(qLower),
    endAt(qLower + "\uf8ff"),
    limit(max)
  );

  const byLast = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("lastNameLower"),
    startAt(qLower),
    endAt(qLower + "\uf8ff"),
    limit(max)
  );

  const byPhone = qPhone
    ? query(
        clientsCol,
        where("ownerUid", "==", ownerUid),
        orderBy("phoneLower"),
        startAt(qPhone),
        endAt(qPhone + "\uf8ff"),
        limit(max)
      )
    : null;

  const byEmail = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("emailLower"),
    startAt(qLower),
    endAt(qLower + "\uf8ff"),
    limit(max)
  );

  const [nameSnap, lastSnap, phoneSnap, emailSnap] = await Promise.all([
    getDocs(byName),
    getDocs(byLast),
    byPhone ? getDocs(byPhone) : Promise.resolve({ docs: [] }),
    getDocs(byEmail),
  ]);

  const map = new Map();
  for (const docSnap of [
    ...nameSnap.docs, 
    ...lastSnap.docs,
    ...phoneSnap.docs, 
    ...emailSnap.docs]) {
    const d = { id: docSnap.id, ...docSnap.data() };
    map.set(d.id, d);
  }
  return Array.from(map.values()).sort((a, b) => (a.nameLower || "").localeCompare(b.nameLower || ""))
  .slice(0, max);
}
