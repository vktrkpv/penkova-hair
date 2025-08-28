import {
  addDoc, collection, serverTimestamp,
  query, where, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../lib/firebase";

// колекція "clients" на верхньому рівні
const clientsCol = collection(db, "clients");

// normalize для пошуку
const toLower = (s="") => s.trim().toLowerCase();

export function listenMyClients(ownerUid, cb, onError) {
  // всі клієнти поточного користувача, відсортовані за ім'ям
  const q = query(
    clientsCol,
    where("ownerUid", "==", ownerUid),
    orderBy("nameLower")
  );
  // Realtime підписка
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(list);
  }, onError);
}

export async function addClient({ ownerUid, name, phone="", email="", notes="" }) {
  const now = serverTimestamp();
  return addDoc(clientsCol, {
    ownerUid,
    name: name.trim(),
    nameLower: toLower(name),
    phone: phone.trim(),
    email: email.trim(),
    notes: notes.trim(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateClient(id, data) {
  const ref = doc(db, "clients", id);
  const patch = {
    ...data,
    ...(data.name ? { nameLower: toLower(data.name) } : {}),
    updatedAt: serverTimestamp(),
  };
  return updateDoc(ref, patch);
}

export async function deleteClient(id) {
  const ref = doc(db, "clients", id);
  return deleteDoc(ref);
}
