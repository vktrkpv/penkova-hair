// + додаємо:
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
// + додаємо onSnapshot і db
import { db } from "../lib/firebase";


// локальні утиліти часу
const toMin = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};
// з "YYYY-MM-DD" + "HH:mm" робимо ms (локально)
const makeMs = (dateISO, hhmm) => {
  const [y, M, d] = dateISO.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(y, M - 1, d, h, m, 0, 0).getTime();
};

/** ⬇️ 1) зайняті інтервали за день */
export async function fetchBusyForDate(stylistUid, dateISO /* "YYYY-MM-DD" */) {
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
    const startMs = a.start;                     // у тебе start в мс
    const durationMin = a.durationMin || 0;
    const endMs = startMs + durationMin * 60 * 1000;
    // повертаємо в ХВИЛИНАХ від початку доби для простих перетинів
    const startMin = Math.floor((startMs - dayStart) / 60000);
    const endMin = Math.floor((endMs   - dayStart) / 60000);
    return { startMin, endMin };
  });
}

/** ⬇️ 2) генератор вільних слотів */
export function generateSlots({ dayStart, dayEnd, stepMin, durationMin, busy, dayBreaks = [] }) {
  const dayStartMin = toMin(dayStart);
  const dayEndMin = toMin(dayEnd);
  // breaks додаємо до busy
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

/** ⬇️ 3) створення апоінтмента */
export async function createAppointment(docData) {
  const ref = collection(db, "appointments");
  return addDoc(ref, {
    ...docData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "booked",
  });
}

// (експортуємо утиліти якщо треба у компонентах)
export const timeUtils = { toMin, toHHMM, makeMs };

// ⬇️ слухач бронювань у видимому діапазоні календаря
export function listenAppointmentsRange(stylistUid, fromMs, toMs, cb, onError) {
  // Потрібен індекс: appointments — stylistUid(Asc), start(Asc)
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


// оновити бронювання
export async function updateAppointment(id, patch) {
  await updateDoc(doc(db, "appointments", id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

// видалити бронювання
export async function deleteAppointment(id) {
  await deleteDoc(doc(db, "appointments", id));
}
