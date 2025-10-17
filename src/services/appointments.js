import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";


const toMin = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};
const makeMs = (dateISO, hhmm) => {
  const [y, M, d] = dateISO.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(y, M - 1, d, h, m, 0, 0).getTime();
};

export async function fetchBusyForDate(stylistUid, dateISO ) {
  const dayStart = new Date(dateISO + "T00:00:00").getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const qRef = query(
    collection(db, "appointments"),
    where("stylistUid", "==", stylistUid),
    where("start", ">=", dayStart),
    where("start", "<", dayEnd),
    orderBy("start", "asc")
  );
  const snap = await getDocs(qRef);

  return snap.docs.map((d) => {
    const a = d.data();
    const startMs = a.start;                     
    const durationMin = a.durationMin || 0;
    const endMs = startMs + durationMin * 60 * 1000;
    const startMin = Math.floor((startMs - dayStart) / 60000);
    const endMin = Math.floor((endMs   - dayStart) / 60000);
    return { startMin, endMin };
  });
}

export function generateSlots({ dayStart, dayEnd, stepMin, durationMin, busy, dayBreaks = [] }) {
  const dayStartMin = toMin(dayStart);
  const dayEndMin = toMin(dayEnd);
  const allBusy = [
    ...busy,
    ...dayBreaks.map((b) => ({ startMin: toMin(b.start), endMin: toMin(b.end) })),
  ];

  const slots = [];
  for (let t = dayStartMin; t + durationMin <= dayEndMin; t += stepMin) {
    const s = t;
    const e = t + durationMin;
    const overlap = allBusy.some((b) => Math.max(b.startMin, s) < Math.min(b.endMin, e));
    if (!overlap) slots.push(toHHMM(s));
  }
  return slots;
}

export async function createAppointment(docData) {
  const ref = collection(db, "appointments");
  return addDoc(ref, {
    ...docData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "booked",
  });
}

export const timeUtils = { toMin, toHHMM, makeMs };

export function listenAppointmentsRange(stylistUid, fromMs, toMs, cb, onError) {
  const qRef = query(
    collection(db, "appointments"),
    where("stylistUid", "==", stylistUid),
    where("start", ">=", fromMs),
    where("start", "<", toMs),
    orderBy("start", "asc")
  );

  return onSnapshot(
    qRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cb(list);
    },
    onError
  );
}


export async function updateAppointment(id, patch) {
  await updateDoc(doc(db, "appointments", id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAppointment(id) {
  await deleteDoc(doc(db, "appointments", id));
}
