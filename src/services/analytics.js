// src/services/analytics.js
import {
  collection, query, where, onSnapshot,
  collectionGroup, orderBy, limit, getDocs
} from "firebase/firestore";
import { db } from "../lib/firebase";

// 1) realtime кількість клієнтів
export function listenClientsCount(ownerUid, cb, onError) {
  const q = query(collection(db, "clients"), where("ownerUid", "==", ownerUid));
  return onSnapshot(q, (snap) => cb(snap.size), onError);
}

// 2) процедури за 30 днів: count + sum(price) (realtime)
export function listenProceduresLast30d(stylistUid, cb, onError) {
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const q = query(
    collectionGroup(db, "procedures"),
    where("stylistUid", "==", stylistUid),
    where("date", ">=", since) // ми зберігаємо date як мілісекунди
  );
  return onSnapshot(q, (snap) => {
    let count = 0;
    let sum = 0;
    snap.forEach((doc) => {
      count++;
      const p = doc.data().price;
      if (typeof p === "number" && !Number.isNaN(p)) sum += p;
    });
    cb({ count, sum });
  }, onError);
}

// 3) останні 5 процедур (realtime)
export function listenRecentProcedures(stylistUid, cb, onError) {
  const q = query(
    collectionGroup(db, "procedures"),
    where("stylistUid", "==", stylistUid),
    orderBy("date", "desc"),
    limit(5)
  );
  return onSnapshot(q, async (snap) => {
    // Нам ще треба ім'я клієнта. clientId є у шляхові документа.
    const items = [];
    for (const d of snap.docs) {
      const data = d.data();
      // шлях виглядає: clients/{clientId}/procedures/{procId}
      const path = d.ref.path.split("/");
      const clientId = path[1];
      items.push({
        id: d.id,
        clientId,
        serviceType: data.serviceType || "",
        price: data.price ?? null,
        date: data.date,
        dateStr: new Date(data.date).toLocaleDateString(),
      });
    }

    // Підтягнемо імена клієнтів одним махом (не строго обов'язково):
    // простий спосіб — зробити паралельні getDocs на клієнтів, що згадуються.
    // Для MVP можемо залишити без імені (або показати clientId).
    cb(items);
  }, onError);
}
