// src/services/blocks.js
import {
  addDoc, collection, serverTimestamp,
  query, where, onSnapshot, orderBy,
  deleteDoc, doc, getDocs, updateDoc
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COL = "adminBlocks";

/** Створити блок */
export async function addBlock(ownerId, startMs, endMs, reason = "") {
  if (!ownerId) throw new Error("Missing ownerId");
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    throw new Error("Missing start/end");
  }
  if (endMs <= startMs) throw new Error("End must be after start");

  const ref = await addDoc(collection(db, COL), {
    ownerId,
    start: startMs,         // зберігаємо у ms
    end: endMs,
    reason,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Слухач блоків у діапазоні [fromMs, toMs) */
export function listenBlocksRange(ownerId, fromMs, toMs, onData, onError) {
  const q1 = query(
    collection(db, COL),
    where("ownerId", "==", ownerId),
    orderBy("start", "asc")
  );

  return onSnapshot(
    q1,
    (snap) => {
      const rows = [];
      snap.forEach((d) => {
        const data = d.data();
        // локальна перевірка перетину діапазонів
        if (data.start < toMs && data.end > fromMs) {
          rows.push({ id: d.id, ...data });
        }
      });
      onData(rows);
    },
    onError
  );
}

/** Отримати блоки, що перетинаються з інтервалом */
export async function getOverlappingBlocks(ownerId, startMs, endMs) {
  const q1 = query(
    collection(db, COL),
    where("ownerId", "==", ownerId),
    where("start", "<", endMs),
    orderBy("start", "asc")
  );
  const snap = await getDocs(q1);

  const rows = [];
  snap.forEach((d) => {
    const b = d.data();
    if (b.end > startMs) rows.push({ id: d.id, ...b });
  });
  return rows;
}

/** Оновити блок (час/причину) */
export async function updateBlock(blockId, updates = {}) {
  const payload = {};
  if (updates.start instanceof Date) payload.start = updates.start.getTime();
  if (updates.end   instanceof Date) payload.end   = updates.end.getTime();
  if (typeof updates.reason === "string") payload.reason = updates.reason;
  if (!Object.keys(payload).length) return;
  await updateDoc(doc(db, COL, blockId), payload);
}

/** Видалити блок */
export async function deleteBlock(blockId) {
  await deleteDoc(doc(db, COL, blockId));
}
