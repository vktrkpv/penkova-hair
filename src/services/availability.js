import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";



export async function getAvailabilityForDate(stylistUid, dateISO) {
  const snap = await getDoc(doc(db, "availability", stylistUid));
  if (!snap.exists()) return null;
  const data = snap.data();

  const wd = new Date(dateISO + "T00:00:00").getDay(); // 0..6

  // overrides має пріоритет
  if (data.overrides?.[dateISO] === null) return { closed: true };
  if (data.overrides?.[dateISO]) {
    const { start, end } = data.overrides[dateISO];
    return { closed: false, start, end, stepMin: data.stepMin || 15, breaks: data.breaks?.[wd] || [] };
  }

  const day = data.weekly?.[wd] || null;
  if (!day) return { closed: true };
  return { closed: false, start: day.start, end: day.end, stepMin: data.stepMin || 15, breaks: data.breaks?.[wd] || [] };
}
