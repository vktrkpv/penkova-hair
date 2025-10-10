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
const normalizePhone = (s = "") => s.replace(/\D/g, ""); // тільки цифри

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
    phone: phone.trim(),
    phoneLower: normalizePhone(phone),   // ⬅️ додали
    email: email.trim(),
    emailLower: toLower(email),          // ⬅️ додали
    notes: notes.trim(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateClient(id, data) {
  const ref = doc(db, "clients", id);
  const patch = {
    ...data,
    ...(data.name  ? { nameLower: toLower(data.name) }     : {}),
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

/**
 * Пошук клієнтів:
 * - порожній запит → перші N по імені
 * - непорожній → префікс-пошук у nameLower, phoneLower, emailLower (3 окремі запити), злиття результатів
 * ВАЖЛИВО: може знадобитися створити індекси для orderBy(nameLower|phoneLower|emailLower) з where(ownerUid==)
 */
export async function searchClients(ownerUid, qStr = "", max = 20) {
  const q = qStr.trim();
  const qLower = toLower(q);
  const qPhone = normalizePhone(q);

  // 0) без запиту — просто перші N за ім'ям
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

  // 1) nameLower префікс
  const byName = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("nameLower"),
    startAt(qLower),
    endAt(qLower + "\uf8ff"),
    limit(max)
  );

  // 2) phoneLower префікс (тільки якщо є цифри)
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

  // 3) emailLower префікс (корисно при наявності @)
  const byEmail = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("emailLower"),
    startAt(qLower),
    endAt(qLower + "\uf8ff"),
    limit(max)
  );

  const [nameSnap, phoneSnap, emailSnap] = await Promise.all([
    getDocs(byName),
    byPhone ? getDocs(byPhone) : Promise.resolve({ docs: [] }),
    getDocs(byEmail),
  ]);

  // зливаємо унікально
  const map = new Map();
  for (const docSnap of [...nameSnap.docs, ...phoneSnap.docs, ...emailSnap.docs]) {
    const d = { id: docSnap.id, ...docSnap.data() };
    map.set(d.id, d);
  }
  // легке сортування: ім'я, далі телефон/емейл
  return Array.from(map.values()).sort((a, b) => (a.nameLower || "").localeCompare(b.nameLower || ""));
}
